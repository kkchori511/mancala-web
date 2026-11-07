import { createGame, applyMove, legalMoves, cloneGame, scores, base, storeIndex, twoPlayerConfig, fourPlayerConfig, ownerOf, isStore } from './engine.js';
import { chooseMove } from './ai.js';
import { layout2pLandscape, layout2pPortrait, layout4p } from './geometry.js';
import { BoardView, PLAYER_COLORS } from './board.js';
import { play, setSound, unlockAudio } from './sound.js';

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
let cfg = null; // { mode:'2p'|'ai'|'4p', display, level, names, start }
let game = null;
let view = null;
let busy = false;
let pendingConfirm = null;
let wakeLock = null;

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

// ───────── 화면 전환 ─────────
function show(id) {
  ['start', 'fourPick', 'game'].forEach((s) => $('#' + s).classList.toggle('hidden', s !== id));
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
  if (isPortrait()) {
    // 같이 하기: 지금 차례인 사람이 아래. 컴퓨터와 하기: 사람(0)이 항상 아래
    const v = cfg.mode === 'ai' ? 0 : game.current;
    return layout2pPortrait(v);
  }
  return layout2pLandscape();
}

function buildView(logLines = []) {
  view = new BoardView($('#stage'), { layout: makeLayout(), players: game.players, names: cfg.names, settings });
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
  if (!game.over && !isAI(p) && !busy) for (const m of legalMoves(game)) sel.push(base(game, p) + m);
  view.setActive(p, { selectable: sel });
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
  // 스마트폰 세로 같이 하기: 차례가 바뀌면 보드를 돌려 지금 차례인 사람이 아래로
  if (view.L.kind === '2p-port' && cfg.mode === '2p' && view.L.view !== p) await flipTo();
  refreshActive();
  if (isAI(p)) {
    busy = true; refreshActive();
    await sleep(650);
    const m = chooseMove(game, cfg.level);
    await doMove(m);
  }
}

async function flipTo() {
  const stage = $('#stage');
  busy = true;
  stage.classList.add('flipping');
  await sleep(720);
  stage.style.transition = 'none';
  stage.classList.remove('flipping');
  buildView(view.logLines);
  void stage.offsetWidth;
  stage.style.transition = '';
  busy = false;
}

// ───────── 칸 누르기 ─────────
function onCell(i) {
  unlockAudio();
  if (busy || game.over) return;
  const p = game.current;
  if (isAI(p)) return;
  const cell = view.L.cells[i];
  const local = i - base(game, p);
  if (cell.kind !== 'pit' || cell.owner !== p || game.board[i] === 0) {
    play('deny'); view.shake(i); return;
  }
  if (!settings.confirm) { closeConfirm(); doMove(local); return; }
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
    if (act === 'yes') doMove(local);
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
  if (!game.over && game.current !== p && !(view.L.kind === '2p-port' && cfg.mode === '2p')) banner(`${nameOf(game.current)} 차례`, game.current, true);
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
  localStorage.removeItem(SAVE_KEY);
  keepAwake(false);
  play('fanfare');
  const s = scores(game);
  const order = s.map((v, p) => ({ p, v })).sort((a, b) => b.v - a.v);
  const top = order[0].v;
  const winners = order.filter((o) => o.v === top);
  const title = winners.length > 1 ? '무승부!' : `${esc(nameOf(winners[0].p))} 승리!`;
  await sleep(500);
  openModal(`<h3>${title}</h3>
    <ol class="result-list">${order.map((o, k) => `<li class="${o.v === top ? 'win' : ''}"><span>${k + 1}위</span><span class="dot" style="background:${PLAYER_COLORS[o.p]}"></span><span>${esc(nameOf(o.p))}</span><span class="sc">${o.v}</span></li>`).join('')}</ol>
    <div class="actions"><button class="btn ghost" data-act="home">처음으로</button><button class="btn primary" data-act="again">다시 하기</button></div>`, (act) => {
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

// 4인 시작 룰 안내: 모니터는 하나, 태블릿은 네 방향에 각각
function rulesAck() {
  return new Promise((resolve) => {
    if (cfg.display === 'monitor') {
      openModal(`<div class="rules"><h3>4인 전용 룰</h3><ul>${fourRulesItems()}</ul></div><div class="actions"><button class="btn primary" data-act="ok">모두 확인했어요</button></div>`, (a) => { if (a === 'ok') { closeModal(); resolve(); } }, false);
      return;
    }
    const wrap = document.createElement('div');
    wrap.className = 'ack-wrap';
    const done = new Set();
    for (let p = 0; p < 4; p++) {
      const rot = [0, -90, 180, 90][p];
      const d = [[0, 1], [1, 0], [0, -1], [-1, 0]][p];
      const card = document.createElement('div');
      card.className = 'ack';
      card.style.borderTop = `6px solid ${PLAYER_COLORS[p]}`;
      card.style.transform = `translate(-50%, -50%) translate(${d[0] * 24}vmin, ${d[1] * 24}vmin) rotate(${rot}deg)`;
      card.innerHTML = `<h4>${esc(nameOf(p))} · 4인 전용 룰</h4><ul>${fourRulesItems()}</ul><button class="btn primary" style="background:${PLAYER_COLORS[p]}">확인</button>`;
      card.querySelector('button').addEventListener('click', () => {
        unlockAudio(); play('select');
        done.add(p); card.classList.add('done'); card.querySelector('button').textContent = '확인 완료';
        if (done.size === 4) { wrap.remove(); resolve(); }
      });
      wrap.appendChild(card);
    }
    $('#overlay').appendChild(wrap);
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
      openModal(`<h3>그만둘까요?</h3><p>진행 중인 게임은 사라집니다.</p><div class="actions"><button class="btn ghost" data-act="no">아니요</button><button class="btn danger" data-act="yes">그만두기</button></div>`, (a) => {
        if (a === 'yes') { localStorage.removeItem(SAVE_KEY); closeModal(); goHome(); } else closeModal();
      });
    }
  });
}

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
window.__mancala = { get game() { return game; }, get cfg() { return cfg; }, get view() { return view; }, get busy() { return busy; }, settings };

refreshStart();
