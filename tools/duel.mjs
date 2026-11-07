// 온라인 2인 대전 시험: 헤드리스 Chrome 두 개(서로 다른 익명 사용자)로 방 만들기 → 참가 → 대전
// 사용: node tools/duel.mjs <url> <출력 폴더>
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url = 'http://localhost:8770/', outDir = '.'] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch(name, w, h, mobile = false) {
  const port = 9300 + Math.floor(Math.random() * 600);
  const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'duel-'))}`, 'about:blank'], { stdio: 'ignore' });
  let tabs;
  for (let i = 0; i < 100; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.find((t) => t.type === 'page')) break; } catch { /* 대기 */ } await sleep(100); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = new Map(); const logs = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type !== 'log') logs.push(`[${name}] ${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 200));
    if (m.method === 'Runtime.exceptionThrown') logs.push(`[${name}] EXCEPTION: ` + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
  if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await send('Page.enable');
  const b = {
    name, logs, proc,
    async eval(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.result?.exceptionDetails) throw new Error(`[${name}] ${r.result.exceptionDetails.exception?.description}`);
      return r.result?.result?.value;
    },
    async goto(u) { await send('Page.navigate', { url: u }); await sleep(1500); await this.eval(HELPERS); },
    async reload() { await send('Page.reload', {}); await sleep(1500); await this.eval(HELPERS); },
    async shot(file) { const s = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(outDir, file), Buffer.from(s.result.data, 'base64')); },
    kill() { ws.close(); proc.kill('SIGKILL'); },
  };
  return b;
}

// 페이지 안 도우미
const HELPERS = `
window.__t = {
  sl: (ms) => new Promise((r) => setTimeout(r, ms)),
  st() { const M = window.__mancala; return { mode: M.cfg?.mode, me: M.cfg?.me, round: M.cfg?.round, board: M.game?.board?.join(','), moves: M.game?.moveCount, cur: M.game?.current, over: M.game?.over, busy: M.busy, modal: document.querySelector('#modal').classList.contains('hidden') ? '' : document.querySelector('#modalCard').innerText.replace(/\\s+/g, ' ').slice(0, 80), notes: [...document.querySelectorAll('.net-note')].map((e) => e.textContent).join(' | ') }; },
  async move() {
    const M = window.__mancala;
    if (!M.game || M.game.over || M.busy || M.cfg.mode !== 'online' || M.game.current !== M.cfg.me) return false;
    const g = M.game, b = g.current * 7;
    const legal = [0, 1, 2, 3, 4, 5].filter((i) => g.board[b + i]);
    const k = legal[Math.floor(Math.random() * legal.length)];
    M.view.cellEls[b + k].querySelector('.hit').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await this.sl(80);
    const y = document.querySelector('.confirm [data-act="yes"]');
    if (!y) return false;
    y.click(); return true;
  },
  click(sel) { const e = document.querySelector(sel); if (!e) return false; e.click(); return true; },
};
localStorage.setItem('mancala.settings.v1', JSON.stringify({ speed: 'fast', sound: false }));
true`;

const report = [];
const ok = (cond, msg) => { report.push(`${cond ? 'OK ' : 'FAIL'} ${msg}`); console.log(`${cond ? 'OK ' : 'FAIL'} ${msg}`); };
const st = (b) => b.eval('__t.st()');
async function waitFor(b, expr, ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (await b.eval(expr)) return true; await sleep(200); }
  return false;
}
// 둘 다 끝날 때까지(또는 n수) 번갈아 자동으로 둠
async function playUntil(A, B, maxMoves = 999) {
  let n = 0;
  for (let i = 0; i < 4000 && n < maxMoves; i++) {
    const [sa, sb] = [await st(A), await st(B)];
    if (sa.over && sb.over && !sa.busy && !sb.busy) break;
    if (await A.eval('__t.move()')) n++;
    else if (await B.eval('__t.move()')) n++;
    await sleep(120);
  }
  return n;
}
async function synced(A, B, ms = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const [sa, sb] = [await st(A), await st(B)];
    if (!sa.busy && !sb.busy && sa.board === sb.board && sa.moves === sb.moves) return [true, sa, sb];
    await sleep(250);
  }
  const [sa, sb] = [await st(A), await st(B)];
  return [false, sa, sb];
}

const A = await launch('A', 1280, 800);
const B = await launch('B', 390, 844, true);
try {
  await A.goto(url); await B.goto(url);
  await A.eval(`localStorage.removeItem('mancala.online.v1'); true`);
  // 1. 방 만들기
  await A.eval(`__t.click('#onlineBtn'); document.querySelector('#onName').value = '에이'; __t.click('#onCreate'); true`);
  ok(await waitFor(A, `!document.querySelector('#onlineWait').classList.contains('hidden')`), 'A 방 만들기 → 대기 화면');
  const code = await A.eval(`document.querySelector('#roomCode').textContent`);
  ok(/^[A-HJ-NP-Z2-9]{4}$/.test(code), `방 코드 형식 (${code})`);
  await A.shot('1-wait.png');
  // 잘못된 코드
  await B.eval(`__t.click('#onlineBtn'); document.querySelector('#onName').value = '비'; document.querySelector('#onCode').value = 'ZZZZ'; __t.click('#onJoin'); true`);
  ok(await waitFor(B, `/방이 없어요/.test(document.querySelector('#onMsg').textContent)`), '없는 코드 → 안내 문구');
  // 2. 참가
  await B.eval(`document.querySelector('#onCode').value = '${code.toLowerCase()}'; __t.click('#onJoin'); true`);
  ok(await waitFor(A, `__t.st().mode === 'online' && !document.querySelector('#game').classList.contains('hidden')`), 'A 게임 화면 시작');
  ok(await waitFor(B, `__t.st().mode === 'online' && !document.querySelector('#game').classList.contains('hidden')`), 'B 게임 화면 시작');
  const [a0, b0] = [await st(A), await st(B)];
  ok(a0.me === 0 && b0.me === 1 && a0.cur === b0.cur, `자리 A=${a0.me} B=${b0.me}, 선공 ${a0.cur}`);
  // 3인째 참가 거부
  const C = await launch('C', 800, 600);
  await C.goto(url);
  await C.eval(`__t.click('#onlineBtn'); document.querySelector('#onCode').value = '${code}'; __t.click('#onJoin'); true`);
  ok(await waitFor(C, `/이미 두 명/.test(document.querySelector('#onMsg').textContent)`), '세 번째 사람 참가 거부');
  // 남의 차례에 수 쓰기(규칙 위반) 직접 시도 → 거부
  const cheat = await C.eval(`(async () => { const o = await import('./src/online.js'); await o.connect(); try { await o.sendMove('${code}', 0, 0, 0, 0, 0, false); return 'written'; } catch (e) { return String(e.message || e); } })()`);
  ok(/permission/i.test(cheat), `다른 사람이 수 쓰기 → 거부 (${cheat.slice(0, 40)})`);
  C.kill();

  // 3. 한 판 끝까지
  await sleep(1500);
  await playUntil(A, B, 6);
  await A.shot('2-mid-A.png'); await B.shot('2-mid-B.png');
  const n1 = await playUntil(A, B);
  const [s1, sa1, sb1] = await synced(A, B);
  ok(s1 && sa1.over && sb1.over, `한 판 끝까지 (${sa1.moves}수) 두 화면 보드 일치`);
  ok(await waitFor(A, `/승리|졌어요|무승부/.test(__t.st().modal)`) && await waitFor(B, `/승리|졌어요|무승부/.test(__t.st().modal)`), '양쪽 결과 창');
  await A.shot('3-result-A.png'); await B.shot('3-result-B.png');

  // 4. 다시 하기 → 1라운드, 선공 교대
  await B.eval(`__t.click('#modal [data-act="again"]')`);
  ok(await waitFor(A, `__t.st().round === 1 && !__t.st().over`) && await waitFor(B, `__t.st().round === 1`), '다시 하기 → 양쪽 새 판');
  const [a2] = [await st(A)];
  ok(a2.cur === 1 - a0.cur, `선공 교대 (첫 판 ${a0.cur} → 새 판 ${a2.cur})`);

  // 5. 몇 수 두고 A 새로 고침 → 자동 재접속, 같은 보드
  await sleep(1200);
  await playUntil(A, B, 5);
  await synced(A, B);
  await A.reload();
  ok(await waitFor(A, `__t.st().mode === 'online' && __t.st().round === 1`, 20000), 'A 새로 고침 → 같은 방 자동 재접속');
  const [s3, sa3, sb3] = await synced(A, B);
  ok(s3, `재접속 뒤 보드 일치 (${sa3.moves}수)`);
  await playUntil(A, B, 3);
  ok((await synced(A, B))[0], '재접속 뒤 계속 진행 일치');

  // 6. B 그만두기 → A 승리(기권)
  await B.eval(`__t.click('#menuBtn'); __t.click('#modal [data-act="quit"]'); __t.click('#modal [data-act="yes"]'); true`);
  ok(await waitFor(A, `/승리/.test(__t.st().modal) && /그만뒀/.test(__t.st().modal)`), 'B 그만두기 → A에 기권승 표시');
  await A.shot('4-quit-A.png');
  ok(await waitFor(B, `!document.querySelector('#start').classList.contains('hidden')`), 'B 처음 화면으로');

  // 7. 연결 끊김: B 다시 참가할 수 없으니 새 방으로
  await A.eval(`__t.click('#modal [data-act="home"]')`);
  await sleep(800);
  await A.eval(`__t.click('#onlineBtn'); __t.click('#onCreate'); true`);
  await waitFor(A, `!document.querySelector('#onlineWait').classList.contains('hidden')`);
  const code2 = await A.eval(`document.querySelector('#roomCode').textContent`);
  await B.eval(`__t.click('#onlineBtn'); document.querySelector('#onCode').value = '${code2}'; __t.click('#onJoin'); true`);
  ok(await waitFor(A, `__t.st().mode === 'online' && __t.st().round === 0 && !document.querySelector('#game').classList.contains('hidden')`), `새 방 ${code2} 시작`);
  await sleep(1500);
  await playUntil(A, B, 3);
  B.kill();
  const t0 = Date.now();
  ok(await waitFor(A, `/연결이 끊겼어요/.test(__t.st().notes)`, 15000), 'B 끊김 → A에 카운트다운');
  await A.shot('5-disc-A.png');
  ok(await waitFor(A, `/승리/.test(__t.st().modal)`, 60000), `30초 뒤 A 기권승 (끊긴 뒤 ${Math.round((Date.now() - t0) / 1000)}초)`);
  await A.shot('6-disc-result-A.png');
  // A 나가기 → 방 정리
  await A.eval(`__t.click('#modal [data-act="home"]')`);
  await sleep(1500);
  const gone = await A.eval(`(async () => { const o = await import('./src/online.js'); let v = 'x'; o.watchRoom('${code2}', (r) => { v = r; }); await new Promise((r) => setTimeout(r, 1500)); return v === null; })()`);
  ok(gone, '혼자 남은 사람이 나가면 방 기록 삭제');
} catch (e) {
  ok(false, 'error: ' + e.message);
} finally {
  console.log('--- 로그(경고/오류) ---');
  console.log([...A.logs, ...B.logs].slice(0, 30).join('\n') || '(없음)');
  A.kill(); try { B.kill(); } catch { /* 이미 끝 */ }
  process.exit(0);
}
