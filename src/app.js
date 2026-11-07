import { createGame, applyMove, legalMoves, cloneGame, scores, base, storeIndex, twoPlayerConfig, fourPlayerConfig, ownerOf, isStore } from './engine.js';
import { chooseMove } from './ai.js';
import { layout2pLandscape, layout2pPortrait, layout4p } from './geometry.js';
import { BoardView, PLAYER_COLORS } from './board.js';
import { play, setSound, unlockAudio } from './sound.js';
import { BALL_DEFS, ballSVG } from './balls.js';

// 온라인 모듈은 처음 쓸 때만 불러옴
let onlineMod = null;
const online = async () => (onlineMod ??= await import('./online.js'));

const $ = (sel, root = document) => root.querySelector(sel);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

// ───────── 설정 ─────────
const SETTINGS_KEY = 'mancala.settings.v1';
const SAVE_KEY = 'mancala.save.v1';
const DEFAULTS = { sound: true, volume: 0.7, arrows: true, preview: false, confirm: true, speed: 'normal', balance4p: true };
const settings = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
const saveSettings = () => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); setSound(settings.sound, settings.volume); };
setSound(settings.sound, settings.volume);

const hop = () => (settings.speed === 'fast' ? 130 : 240);

// ───────── 상태 ─────────
let cfg = null; // { mode:'2p'|'ai'|'4p'|'online', display, level, names, start, me, code, round }
let game = null;
let view = null;
let busy = false;
let pendingConfirm = null;
let wakeLock = null;
let net = null; // 온라인 방 상태 { code, seat, room, queue, queued, pumping, stops, ... }
const ONLINE_KEY = 'mancala.online.v1';

const isPortrait = () => window.innerHeight > window.innerWidth;
// 4인: 태블릿·컴퓨터(기기 화면의 짧은 변 600px 이상)에서만, 가로로 들었을 때 진행
const bigDevice = () => Math.min(screen.width, screen.height) >= 600;
const canFour = () => bigDevice();
function updateRotateHint() {
  const need = (cfg?.mode === '4p' && !$('#game').classList.contains('hidden')) || !$('#fourPick').classList.contains('hidden');
  $('#rotateHint').classList.toggle('hidden', !(need && isPortrait()));
}
const nameOf = (p) => cfg.names[p];
const isAI = (p) => cfg.mode === 'ai' && p === 1;
const isRemote = (p) => cfg.mode === 'online' && p !== cfg.me;
const turnText = (p) => (cfg.mode === 'online' && p === cfg.me ? '내 차례' : `${nameOf(p)} 차례`);

// ───────── 화면 전환 ─────────
function show(id) {
  ['start', 'fourPick', 'online', 'game'].forEach((s) => $('#' + s).classList.toggle('hidden', s !== id));
  updateRotateHint();
}

function refreshStart() {
  const ok = canFour();
  $('#fourBtn').disabled = !ok;
  $('#fourDesc').textContent = ok ? '모니터·태블릿 전용 (가로)' : '모니터·태블릿에서만 가능';
  const saved = loadSave();
  $('#resumeBox').classList.toggle('hidden', !saved);
  if (saved) {
    const label = { '2p': '둘이 하기', ai: '컴퓨터와 하기', '4p': '넷이 하기' }[saved.cfg.mode];
    $('#resumeInfo').textContent = `${label} · ${saved.game.moveCount}수 진행`;
  }
}

function readNames(mode) {
  const n = [...document.querySelectorAll('[data-name]')].map((el, i) => el.value.trim() || `P${i + 1}`);
  if (mode === 'ai') { n[0] = document.querySelector('[data-name="0"]').value.trim() || '나'; n[1] = '컴퓨터'; }
  return n;
}

// ───────── 저장 / 이어 하기 ─────────
function save() {
  if (cfg?.mode === 'online') return; // 온라인은 서버에 기록됨
  if (!game || game.over) { localStorage.removeItem(SAVE_KEY); return; }
  localStorage.setItem(SAVE_KEY, JSON.stringify({ cfg, game, log: view?.logLines ?? [] }));
}
function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { return null; }
}

// ───────── 화면 꺼짐 방지 ─────────
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* 지원 안 함 */ }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && game && !game.over) keepAwake(true); });

// ───────── 보드 만들기 ─────────
function makeLayout() {
  if (cfg.mode === '4p') return layout4p(cfg.display);
  if (cfg.mode === 'online') return isPortrait() ? layout2pPortrait(cfg.me) : layout2pLandscape(cfg.me); // 내 칸이 아래
  if (isPortrait()) {
    // 마주 보고 하기: P1(사람)이 아래, P2가 위. 보드는 돌리지 않음
    return layout2pPortrait(0);
  }
  return layout2pLandscape();
}

function buildView(logLines = []) {
  view = new BoardView($('#stage'), { layout: makeLayout(), players: game.players, names: cfg.names, settings, upright: cfg.mode === 'online' });
  $('#game').dataset.kind = view.L.kind;
  view.logLines = logLines;
  if (view.L.log) view.renderLog();
  view.setAll(game.board);
  view.onCell = onCell;
  refreshActive();
}

function refreshActive() {
  if (!view) return;
  const p = game.over ? -1 : game.current;
  const sel = [];
  if (!game.over && !isAI(p) && !isRemote(p) && !busy) for (const m of legalMoves(game)) sel.push(base(game, p) + m);
  view.setActive(p, { selectable: sel });
  // 마주 보는 2인: 차례인 사람이 가운데 칸 번호를 바로 읽도록
  if (cfg.mode === '2p' && p >= 0) view.facePits(p);
}

// ───────── 게임 시작 ─────────
async function startGame(newCfg, resume = null) {
  cfg = newCfg;
  if (resume) game = resume.game;
  else {
    game = createGame(cfg.mode === '4p' ? fourPlayerConfig(cfg.start, settings.balance4p) : twoPlayerConfig(cfg.start));
    game.balance = cfg.mode === '4p' && settings.balance4p;
  }
  show('game');
  closeConfirm();
  buildView(resume?.log ?? []);
  keepAwake(true);
  save();
  if (cfg.mode === '4p' && !resume) await rulesAck();
  banner(`${nameOf(game.current)} 먼저 시작`, game.current);
  nextTurn();
}

async function nextTurn() {
  if (game.over) { finish(); return; }
  const p = game.current;
  refreshActive();
  if (isAI(p)) {
    busy = true; refreshActive();
    await sleep(650);
    const m = chooseMove(game, cfg.level);
    await doMove(m);
  }
}

// ───────── 칸 누르기 ─────────
function onCell(i) {
  unlockAudio();
  if (busy || game.over) return;
  const p = game.current;
  if (isAI(p)) return;
  if (isRemote(p)) { play('deny'); return; }
  const cell = view.L.cells[i];
  const local = i - base(game, p);
  if (cell.kind !== 'pit' || cell.owner !== p || game.board[i] === 0) {
    play('deny'); view.shake(i); return;
  }
  if (!settings.confirm) { closeConfirm(); playMove(local); return; }
  openConfirm(i, local);
}

function openConfirm(i, local) {
  closeConfirm();
  play('select');
  const p = game.current;
  const col = PLAYER_COLORS[p];
  view.flash(i, col, 0, 'flash-on');
  let previewIdx = null;
  if (settings.preview) {
    const c = cloneGame(game);
    const r = applyMove(c, local);
    previewIdx = r.path[r.path.length - 1];
    view.flash(previewIdx, '#222', 0, 'preview');
  }
  const r = view.cellRect(i);
  const rot = view.textRot(p);
  // 칸에서 보드 가운데 쪽으로 조금 옮긴 자리
  const sr = view.svg.getBoundingClientRect();
  const scale = sr.width / view.L.vb.w;
  const cx = sr.left + view.L.center.x * scale, cy = sr.top + view.L.center.y * scale;
  const px = r.left + r.width / 2, py = r.top + r.height / 2;
  const k = view.L.kind.startsWith('4p') ? 0.55 : 0.5;
  let x = px + (cx - px) * (view.L.kind === '2p-land' ? 0 : k * 0.6);
  let y = py + (cy - py) * k;
  if (view.L.kind === '2p-port') { x = px + (cx - px) * 0.9; y = py; }
  const el = document.createElement('div');
  el.className = 'confirm';
  el.style.borderColor = col;
  el.innerHTML = `<p>${local + 1}번 칸의 공 ${game.board[i]}개를<br>분배할까요?</p>
    <div class="row"><button class="btn ghost" data-act="no">취소</button><button class="btn primary" style="background:${col}" data-act="yes">분배</button></div>`;
  $('#overlay').appendChild(el);
  const w = el.offsetWidth, h = el.offsetHeight;
  x = Math.min(Math.max(x, w / 2 + 6), window.innerWidth - w / 2 - 6);
  y = Math.min(Math.max(y, h / 2 + 6), window.innerHeight - h / 2 - 6);
  el.style.left = `${x - w / 2}px`; el.style.top = `${y - h / 2}px`;
  el.style.transform = `rotate(${rot}deg)`;
  el.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    closeConfirm();
    if (act === 'yes') playMove(local);
  });
  pendingConfirm = { el, i, previewIdx };
}

function closeConfirm() {
  if (!pendingConfirm) return;
  pendingConfirm.el.remove();
  view?.clearMark(pendingConfirm.i);
  if (pendingConfirm.previewIdx != null) view?.clearMark(pendingConfirm.previewIdx);
  pendingConfirm = null;
}

// 내가 고른 수: 온라인이면 서버로 보내고(도착하면 양쪽이 같이 재생), 아니면 바로 둔다
function playMove(local) {
  if (cfg.mode !== 'online') { doMove(local); return; }
  busy = true; refreshActive();
  const c = cloneGame(game);
  applyMove(c, local);
  online().then((o) => o.sendMove(cfg.code, cfg.round, game.moveCount, cfg.me, local, c.current, c.over)).catch(() => {
    note('수를 보내지 못했어요. 다시 맞추는 중…', 2500);
    resyncOnline();
  });
}

// ───────── 수 두기 + 애니메이션 ─────────
async function doMove(local) {
  busy = true;
  refreshActive();
  const before = game.board.slice();
  const p = game.current;
  const res = applyMove(game, local);
  save();
  await animate(before, res);
  busy = false;
  if (!game.over && game.current !== p) banner(turnText(game.current), game.current, true);
  nextTurn();
}

async function animate(before, res) {
  const p = res.player;
  const disp = before.slice();
  const from = base(game, p) + res.pit;
  const myStore = storeIndex(game, p);
  const col = PLAYER_COLORS[p];
  const R = view.ballRadius();
  let pos = view.center(from);
  disp[from] = 0; view.setCount(from, 0);
  let gained = 0;
  for (const idx of res.path) {
    const to = view.center(idx);
    await view.flyBall(0, pos, to, hop(), R);
    disp[idx]++; view.setCount(idx, disp[idx]);
    if (idx === myStore) { play('score'); gained++; view.flash(idx, col, 500); view.pop(idx, '+1', col); }
    else play('drop');
    pos = to;
  }
  const last = res.path[res.path.length - 1];
  let logText = `${res.pit + 1}번 칸`;

  if (res.capture) {
    const { at, from: opp, taken, total } = res.capture;
    play('capture');
    const done = await view.captureBeam(opp, at, col, taken, hop());
    // 상대 칸의 공이 빛줄기를 따라 하나씩 내 칸으로
    const each = Math.max(70, Math.min(hop(), 900 / taken));
    for (let k = 0; k < taken; k++) {
      disp[opp]--; view.setCount(opp, disp[opp]);
      view.flyBall(disp[opp] + 1, view.center(opp), view.center(at), each * 2.2, R);
      await sleep(each);
      if (k % 2 === 0) play('drop');
    }
    await sleep(each * 1.4);
    disp[at] += taken; view.setCount(at, disp[at]);
    await sleep(250);
    done();
    // 모은 공이 한 번에 저장고로
    disp[at] = 0; view.setCount(at, 0);
    await view.flyBall(total, view.center(at), view.center(myStore), hop() * 2, R * 1.3);
    disp[myStore] += total; view.setCount(myStore, disp[myStore]);
    play('captureStore');
    view.flash(myStore, col, 700);
    view.pop(myStore, `캡처 +${total}`, col);
    banner(`캡처! +${total}`, p);
    gained += total;
    logText += ` → 캡처 +${total}`;
    await sleep(500);
  } else if (res.extraTurn) {
    play('extra');
    banner('한 번 더!', p);
    logText += ' → 한 번 더';
    await sleep(300);
  } else if (gained) {
    logText += ` → +${gained}`;
  }
  view.addLog({ p, text: `${nameOf(p)} · ${logText}` });

  if (res.sweep) {
    await sleep(400);
    banner('게임 끝! 남은 공 정리', -1);
    const flights = [];
    for (let q = 0; q < game.players; q++) {
      for (let i = 0; i < game.pits; i++) {
        const idx = base(game, q) + i;
        const n = disp[idx];
        if (!n) continue;
        disp[idx] = 0; view.setCount(idx, 0);
        flights.push(view.flyBall(n, view.center(idx), view.center(storeIndex(game, q)), hop() * 2.5, R).then(() => {
          disp[storeIndex(game, q)] += n; view.setCount(storeIndex(game, q), disp[storeIndex(game, q)]); play('score');
        }));
        await sleep(90);
      }
    }
    await Promise.all(flights);
  }
  // 엔진 상태와 맞춤
  view.setAll(game.board);
  if (last != null && last !== myStore && !res.capture) view.flash(last, col, 500);
}

// ───────── 배너 ─────────
function banner(text, p, small = false) {
  const el = document.createElement('div');
  el.className = 'banner';
  el.style.background = p >= 0 ? PLAYER_COLORS[p] : '#2c2418';
  if (small) el.style.fontSize = 'clamp(16px, 2.6vmin, 26px)';
  const rot = p >= 0 && view ? view.textRot(p) : 0;
  el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
  // 4인 태블릿: 그 사람 쪽으로 조금 옮김
  if (view && view.L.kind === '4p-tablet' && p >= 0) {
    const off = 18; const d = [[0, 1], [1, 0], [0, -1], [-1, 0]][p];
    el.style.left = `${50 + d[0] * off}%`; el.style.top = `${50 + d[1] * off}%`;
  }
  el.textContent = text;
  $('#overlay').appendChild(el);
  setTimeout(() => el.remove(), 1350);
}

// ───────── 끝 ─────────
async function finish() {
  closeConfirm();
  refreshActive();
  if (cfg.mode !== 'online') localStorage.removeItem(SAVE_KEY);
  keepAwake(false);
  play('fanfare');
  const s = scores(game);
  const order = s.map((v, p) => ({ p, v })).sort((a, b) => b.v - a.v);
  const top = order[0].v;
  const winners = order.filter((o) => o.v === top);
  let title = winners.length > 1 ? '무승부!' : `${esc(nameOf(winners[0].p))} 승리!`;
  if (cfg.mode === 'online' && winners.length === 1) title = winners[0].p === cfg.me ? '승리!' : '아쉽게 졌어요';
  await sleep(500);
  openModal(`<h3>${title}</h3>
    <ol class="result-list">${order.map((o, k) => `<li class="${o.v === top ? 'win' : ''}"><span>${k + 1}위</span><span class="dot" style="background:${PLAYER_COLORS[o.p]}"></span><span>${esc(nameOf(o.p))}</span><span class="sc">${o.v}</span></li>`).join('')}</ol>
    <div class="actions"><button class="btn ghost" data-act="home">처음으로</button><button class="btn primary" data-act="again">다시 하기</button></div>`, (act) => {
    if (cfg.mode === 'online') {
      if (act === 'again') askRematch();
      else if (act === 'home') { closeModal(); leaveOnline(); }
      return;
    }
    if (act === 'again') {
      const next = { ...cfg, start: (cfg.start + 1) % game.players };
      closeModal(); startGame(next);
    } else if (act === 'home') { closeModal(); goHome(); }
  }, false);
}

function goHome() {
  closeConfirm();
  keepAwake(false);
  game = null; view = null;
  $('#stage').innerHTML = '';
  show('start');
  // 시작 화면 장식: 당구공 몇 개
$('#logoBalls').innerHTML = `<svg viewBox="0 0 300 76"><defs>${BALL_DEFS}</defs>${[[34, 44, 1], [92, 40, 2], [150, 34, 8], [208, 40, 3], [266, 44, 9]].map(([x, y, n]) => ballSVG(n, x, y, 26, { top: n === 8 })).join('')}</svg>`;
refreshStart();
}

// ───────── 공용 창 ─────────
let modalHandler = null;
function openModal(html, onAct, closable = true) {
  $('#modalCard').innerHTML = html;
  $('#modal').classList.remove('hidden');
  modalHandler = onAct;
  $('#modal').onclick = (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act) { modalHandler?.(act, e.target); return; }
    if (closable && e.target.id === 'modal') closeModal();
  };
}
function closeModal() { $('#modal').classList.add('hidden'); modalHandler = null; }

function rulesHTML() {
  return `<div class="rules"><h3>만칼라 룰</h3>
    <h4>기본 (2인·4인 공통)</h4>
    <ul>
      <li>내 칸 하나를 골라 공을 모두 집어, 화살표 방향(반시계)으로 한 칸에 하나씩 넣습니다.</li>
      <li>내 저장고에는 넣고, 다른 사람의 저장고는 건너뜁니다.</li>
      <li><b>한 번 더</b>: 마지막 공이 내 저장고에 들어가면 한 번 더 합니다.</li>
      <li><b>캡처</b>: 마지막 공이 내 쪽 빈 칸에 떨어지고 맞은편 칸에 공이 있으면, 두 칸의 공을 모두 내 저장고로 가져옵니다.</li>
      <li>누군가의 칸이 모두 비면 게임이 끝나고, 남은 공은 각자 저장고로 갑니다. 저장고에 공이 가장 많은 사람이 이깁니다.</li>
      <li>칸 맨 위 큰 공의 번호가 그 칸의 공 개수입니다.</li>
    </ul>
    <h4>4인 전용</h4>
    <ul>${fourRulesItems()}</ul></div>`;
}
function fourRulesItems() {
  const items = ['한 변에 5칸, 공은 칸마다 4개로 시작합니다.', '캡처할 때 맞은편은 <b>정면에 앉은 사람</b>의 마주 보는 칸입니다.', '<b>한 명이라도</b> 칸이 모두 비면 바로 끝납니다.'];
  if (settings.balance4p) items.push('공정하게: 먼저 하는 <b>1·2번째 사람의 첫 수는 "한 번 더"가 없습니다.</b>', '<b>두 번째 사람은 1점</b>을 갖고 시작합니다.');
  return items.map((t) => `<li>${t}</li>`).join('');
}

function settingsHTML() {
  const sw = (key, label, desc = '') => `<div class="set-row"><div>${label}${desc ? `<small>${desc}</small>` : ''}</div><label class="switch"><input type="checkbox" data-set="${key}" ${settings[key] ? 'checked' : ''}><span></span></label></div>`;
  return `<h3>설정</h3>
    ${sw('sound', '소리')}
    <div class="set-row"><div>음량</div><input type="range" min="0" max="1" step="0.05" value="${settings.volume}" data-set="volume"></div>
    ${sw('arrows', '진행 방향 화살표')}
    ${sw('confirm', '분배 확인창', '끄면 칸을 한 번 누르자마자 분배합니다')}
    ${sw('preview', '마지막 공 미리보기', '확인창이 떠 있는 동안 마지막 공이 떨어질 칸을 표시')}
    ${sw('balance4p', '4인 공정 보정', '1·2번째 사람 첫 수 "한 번 더" 없음, 두 번째 사람 1점 (새 게임부터)')}
    <div class="set-row"><div>애니메이션 속도</div><span class="seg"><button data-speed="normal" ${settings.speed === 'normal' ? 'style="border-color:var(--p1)"' : ''}>보통</button><button data-speed="fast" ${settings.speed === 'fast' ? 'style="border-color:var(--p1)"' : ''}>빠름</button></span></div>
    <div class="actions"><button class="btn primary" data-act="close">닫기</button></div>`;
}

function openSettings() {
  openModal(settingsHTML(), (act) => { if (act === 'close') closeModal(); });
  const card = $('#modalCard');
  card.oninput = card.onchange = (e) => {
    const k = e.target.dataset.set;
    if (!k) return;
    settings[k] = e.target.type === 'checkbox' ? e.target.checked : +e.target.value;
    saveSettings();
    if (k === 'arrows') view?.setArrows(settings.arrows);
  };
  card.querySelectorAll('[data-speed]').forEach((b) => b.addEventListener('click', () => {
    settings.speed = b.dataset.speed; saveSettings(); openSettings();
  }));
}

function openRules() { openModal(rulesHTML() + '<div class="actions"><button class="btn primary" data-act="close">닫기</button></div>', (a) => { if (a === 'close') closeModal(); }); }

// 4인 시작 룰 안내: 전체 화면에 크게, 확인 버튼 하나 (모니터·태블릿 공통)
function rulesAck() {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'rules-full';
    el.innerHTML = `<div class="rules-full-card"><h2>넷이 하기 · 전용 룰</h2><ul>${fourRulesItems()}</ul>
      <button class="btn primary big" data-act="ok">확인하고 시작</button></div>`;
    el.querySelector('[data-act="ok"]').addEventListener('click', () => { unlockAudio(); play('select'); el.remove(); resolve(); });
    $('#overlay').appendChild(el);
  });
}

function openMenu() {
  closeConfirm();
  openModal(`<h3>메뉴</h3>
    <div class="actions" style="justify-content:stretch;flex-direction:column">
      <button class="btn ghost" data-act="rules">룰 보기</button>
      <button class="btn ghost" data-act="settings">설정</button>
      <button class="btn danger" data-act="quit">그만두기</button>
      <button class="btn primary" data-act="close">계속하기</button>
    </div>`, (act) => {
    if (act === 'rules') openRules();
    else if (act === 'settings') openSettings();
    else if (act === 'close') closeModal();
    else if (act === 'quit') {
      if (cfg.mode === 'online') { confirmQuitOnline(); return; }
      openModal(`<h3>그만둘까요?</h3><p>진행 중인 게임은 사라집니다.</p><div class="actions"><button class="btn ghost" data-act="no">아니요</button><button class="btn danger" data-act="yes">그만두기</button></div>`, (a) => {
        if (a === 'yes') { localStorage.removeItem(SAVE_KEY); closeModal(); goHome(); } else closeModal();
      });
    }
  });
}


// ───────── 온라인 ─────────
const DISCONNECT_WAIT = 30; // 상대 연결이 끊기면 기다리는 초
const onMsg = (t = '') => { $('#onMsg').textContent = t; };
const listMoves = (room) => {
  const m = room?.moves?.[room.state.round];
  if (!m) return [];
  return Object.keys(m).map(Number).sort((a, b) => a - b).map((k) => m[k]);
};

// 화면 위쪽 안내 띠 (ms 뒤 사라짐, 0이면 그대로)
function note(text, ms = 0, id = 'note') {
  let el = document.getElementById(id);
  if (!text) { el?.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = id; el.className = 'net-note'; $('#overlay').appendChild(el); }
  el.textContent = text;
  if (ms) setTimeout(() => { if (el.textContent === text) el.remove(); }, ms);
}

function openOnline() {
  show('online');
  $('#onlineForm').classList.remove('hidden');
  $('#onlineWait').classList.add('hidden');
  $('#onName').value = localStorage.getItem('mancala.online.name') || '';
  $('#onCode').value = '';
  onMsg();
}

function lockOnlineForm(on) {
  ['#onCreate', '#onJoin'].forEach((q) => { $(q).disabled = on; });
}

async function enterRoom(fn) {
  const name = $('#onName').value.trim();
  localStorage.setItem('mancala.online.name', name);
  lockOnlineForm(true); onMsg('연결 중…');
  try {
    const o = await online();
    const { code, seat } = await fn(o, name);
    onMsg();
    await attachRoom(code, seat);
  } catch (e) {
    onMsg(e?.message && /[가-힣]/.test(e.message) ? e.message : '연결하지 못했어요. 인터넷 연결을 확인해 주세요.');
    console.warn(e);
  } finally { lockOnlineForm(false); }
}

// 방에 붙기: 접속 표시 + 방 지켜보기
async function attachRoom(code, seat) {
  const o = await online();
  detachRoom();
  localStorage.setItem(ONLINE_KEY, JSON.stringify({ code, seat }));
  net = { code, seat, room: null, queue: [], queued: 0, pumping: false, round: -1, discDeadline: 0, discTimer: null, resultShown: false, connected: true, stops: [] };
  net.stops.push(o.goOnline(code, seat, (c) => {
    if (!net) return;
    if (c) net.ever = true;
    net.connected = c;
    note(c || !net.ever ? '' : '인터넷 연결이 끊겼어요. 다시 연결하는 중…', 0, 'selfNote');
    checkPresence();
  }));
  net.stops.push(o.watchRoom(code, onRoom));
}

function detachRoom() {
  if (!net) return;
  net.stops.forEach((f) => f());
  clearInterval(net.discTimer);
  net = null;
}

function onRoom(room) {
  if (!net) return;
  if (!room || !room.state || !room.seats) {
    // 방이 지워짐(상대가 나가며 정리했거나 오래됨)
    const wasPlaying = cfg?.mode === 'online' && game && !game.over;
    detachRoom(); localStorage.removeItem(ONLINE_KEY);
    if (wasPlaying || $('#online').classList.contains('hidden') === false) {
      goHome(); if (wasPlaying) openModal('<h3>방이 닫혔어요</h3><p>상대가 방을 나갔어요.</p><div class="actions"><button class="btn primary" data-act="ok">확인</button></div>', () => closeModal());
    }
    return;
  }
  net.room = room;
  const st = room.state;
  if (st.status === 'waiting') {
    if (net.seat === 0) {
      show('online');
      $('#onlineForm').classList.add('hidden');
      $('#onlineWait').classList.remove('hidden');
      $('#roomCode').textContent = net.code;
    }
    return;
  }
  if (st.round !== net.round) { startOnlineRound(room); return; }
  // 새로 도착한 수를 차례대로 재생
  const moves = listMoves(room);
  for (let i = net.queued; i < moves.length; i++) net.queue.push(moves[i]);
  net.queued = Math.max(net.queued, moves.length);
  pump();
  checkPresence();
  if (st.result && !net.resultShown) showForfeit(st.result);
}

function onlineCfg(room) {
  const n = [room.seats[0]?.name || 'P1', room.seats[1]?.name || 'P2'];
  return { mode: 'online', names: n, start: room.state.start, me: net.seat, code: net.code, round: room.state.round };
}

// 새 판 시작(또는 다시 들어온 판): 이미 둔 수는 애니메이션 없이 바로 재생
function startOnlineRound(room) {
  closeModal(); closeConfirm();
  cfg = onlineCfg(room);
  net.round = room.state.round;
  net.queue = []; net.resultShown = false;
  game = createGame(twoPlayerConfig(cfg.start));
  const moves = listMoves(room);
  for (const mv of moves) {
    if (game.over || mv.s !== game.current || !game.board[base(game, mv.s) + mv.p]) break;
    applyMove(game, mv.p);
  }
  net.queued = moves.length;
  busy = false;
  show('game');
  buildView();
  keepAwake(true);
  if (game.moveCount === 0) banner(game.current === cfg.me ? '내가 먼저 시작' : `${nameOf(game.current)} 먼저 시작`, game.current);
  else note('다시 연결됐어요', 1800);
  checkPresence();
  if (room.state.result) { showForfeit(room.state.result); return; }
  nextTurn();
}

async function pump() {
  if (!net || net.pumping) return;
  net.pumping = true;
  try {
    while (net && net.queue.length) {
      const mv = net.queue.shift();
      if (game.over || mv.s !== game.current || !game.board[base(game, mv.s) + mv.p]) { resyncOnline(); break; }
      closeConfirm();
      await doMove(mv.p);
    }
  } finally { if (net) net.pumping = false; }
}

// 화면과 서버 기록이 어긋나면 서버 기록으로 다시 맞춤
function resyncOnline() {
  if (!net?.room) return;
  net.round = -1;
  onRoom(net.room);
}

// 상대 접속 확인: 끊기면 30초 기다린 뒤 기권 처리
function checkPresence() {
  if (!net?.room || cfg?.mode !== 'online') return;
  const st = net.room.state;
  const oppOn = !!net.room.online?.[1 - net.seat];
  const playing = st.status === 'playing' && !st.result && game && !game.over;
  if (oppOn || !playing || !net.connected) {
    if (net.discTimer) { clearInterval(net.discTimer); net.discTimer = null; note('', 0, 'discNote'); }
    return;
  }
  if (net.discTimer) return;
  net.discDeadline = Date.now() + DISCONNECT_WAIT * 1000;
  const tick = async () => {
    const left = Math.ceil((net.discDeadline - Date.now()) / 1000);
    if (left > 0) { note(`${nameOf(1 - net.seat)} 님 연결이 끊겼어요 · ${left}초 기다리는 중`, 0, 'discNote'); return; }
    clearInterval(net.discTimer); net.discTimer = null; note('', 0, 'discNote');
    if (!net.room.online?.[1 - net.seat] && net.connected) (await online()).writeResult(net.code, net.seat, 'disconnect').catch(() => {});
  };
  net.discTimer = setInterval(tick, 1000);
  tick();
}

function showForfeit(result) {
  net.resultShown = true;
  closeConfirm();
  keepAwake(false);
  const win = result.winner === cfg.me;
  const opp = esc(nameOf(1 - cfg.me));
  const why = result.reason === 'quit'
    ? (win ? `${opp} 님이 그만뒀어요.` : '그만두기로 기권했어요.')
    : (win ? `${opp} 님의 연결이 ${DISCONNECT_WAIT}초 넘게 끊겼어요.` : `연결이 ${DISCONNECT_WAIT}초 넘게 끊겨 기권 처리됐어요.`);
  if (win) play('fanfare');
  openModal(`<h3>${win ? '승리!' : '기권패'}</h3><p>${why}</p>
    <div class="actions"><button class="btn ghost" data-act="home">처음으로</button><button class="btn primary" data-act="again">다시 하기</button></div>`, (act) => {
    if (act === 'again') askRematch();
    else if (act === 'home') { closeModal(); leaveOnline(); }
  }, false);
}

async function askRematch() {
  if (!net?.room) return;
  if (!net.room.online?.[1 - net.seat]) { note('상대가 방에 없어요', 2000); return; }
  try { await (await online()).rematch(net.code, net.round); } catch { note('다시 하기를 보내지 못했어요', 2000); }
}

function confirmQuitOnline() {
  const playing = net?.room?.state.status === 'playing' && !net.room.state.result && game && !game.over;
  openModal(`<h3>방에서 나갈까요?</h3><p>${playing ? '진행 중인 게임은 <b>기권패</b>로 처리돼요.' : '방에서 나갑니다.'}</p>
    <div class="actions"><button class="btn ghost" data-act="no">아니요</button><button class="btn danger" data-act="yes">나가기</button></div>`, async (a) => {
    if (a !== 'yes') { closeModal(); return; }
    closeModal();
    if (playing) { try { await (await online()).writeResult(net.code, 1 - net.seat, 'quit'); } catch { /* 연결 없음 */ } }
    leaveOnline();
  });
}

// 방에서 나가기: 상대도 없으면 방 기록을 지움
async function leaveOnline() {
  const n = net;
  localStorage.removeItem(ONLINE_KEY);
  if (n) {
    const alone = !n.room || n.room.state.status === 'waiting' || !n.room.online?.[1 - n.seat];
    detachRoom();
    if (alone) { try { await (await online()).deleteRoom(n.code); } catch { /* 무시 */ } }
  }
  goHome();
}

// 새로 고침 뒤: 있던 방으로 자동으로 다시 들어감
async function resumeOnline() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(ONLINE_KEY) || 'null'); } catch { /* 무시 */ }
  if (!saved?.code) return;
  note('온라인 방에 다시 연결하는 중…', 0, 'resumeNote');
  try {
    const o = await online();
    const { code, seat } = await o.joinRoom(saved.code, '', { rejoinOnly: true });
    note('', 0, 'resumeNote');
    await attachRoom(code, seat);
  } catch (e) {
    console.warn(e);
    note('', 0, 'resumeNote');
    localStorage.removeItem(ONLINE_KEY);
  }
}

$('#onlineBtn').addEventListener('click', () => { unlockAudio(); openOnline(); });
$('#onBack').addEventListener('click', () => { if (net) leaveOnline(); else show('start'); });
$('#onCreate').addEventListener('click', () => enterRoom((o, name) => o.createRoom(name)));
$('#onJoin').addEventListener('click', () => enterRoom((o, name) => o.joinRoom($('#onCode').value, name)));
$('#onCode').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4); });
$('#onCode').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#onJoin').click(); });

// ───────── 시작 화면 연결 ─────────
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-mode]');
  if (t) {
    unlockAudio();
    const mode = t.dataset.mode;
    if (mode === '4p') { if (canFour()) show('fourPick'); return; }
    const names = readNames(mode);
    startGame({ mode, level: t.dataset.level || 'normal', names, start: Math.floor(Math.random() * 2) });
    return;
  }
  const d = e.target.closest('[data-display]');
  if (d) {
    unlockAudio();
    startGame({ mode: '4p', display: d.dataset.display, names: readNames('4p'), start: Math.floor(Math.random() * 4) });
    return;
  }
  const o = e.target.closest('[data-open]');
  if (o) { if (o.dataset.open === 'rules') openRules(); else openSettings(); }
});
$('#fourBack').addEventListener('click', () => show('start'));
$('#menuBtn').addEventListener('click', openMenu);
$('#resumeBtn').addEventListener('click', () => {
  unlockAudio();
  const s = loadSave();
  if (s) startGame(s.cfg, s);
});

// 화면 회전·크기 변화
let resizeT = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    updateRotateHint();
    if (!game) { refreshStart(); return; }
    if (cfg.mode !== '4p' && !busy) {
      const want = isPortrait() ? '2p-port' : '2p-land';
      if (view.L.kind !== want) { closeConfirm(); buildView(view.logLines); }
    }
  }, 150);
});

// 디버그/테스트용
window.__mancala = { get game() { return game; }, get cfg() { return cfg; }, get view() { return view; }, get busy() { return busy; }, get net() { return net; }, settings };

// 시작 화면 장식: 당구공 몇 개
$('#logoBalls').innerHTML = `<svg viewBox="0 0 300 76"><defs>${BALL_DEFS}</defs>${[[34, 44, 1], [92, 40, 2], [150, 34, 8], [208, 40, 3], [266, 44, 9]].map(([x, y, n]) => ballSVG(n, x, y, n === 8 ? 30 : 24, { top: n === 8 })).join('')}</svg>`;
refreshStart();
resumeOnline();
