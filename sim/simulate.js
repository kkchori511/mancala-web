import { createGame, legalMoves, applyMove, scores, cloneGame, storeIndex } from '../src/engine.js';

const GAMES = Number(process.argv[2] ?? 1000);
const SEC_PER_MOVE = 6; // 사람 한 수당 예상 시간(애니메이션 포함)

const strategies = {
  random: (g) => {
    const m = legalMoves(g);
    return m[Math.floor(Math.random() * m.length)];
  },
  greedy: (g) => {
    let best = -Infinity, picks = [];
    for (const m of legalMoves(g)) {
      const c = cloneGame(g);
      const before = c.board[storeIndex(c, c.current)];
      const r = applyMove(c, m);
      const v = c.board[storeIndex(g, g.current)] - before + (r.extraTurn ? 1.5 : 0);
      if (v > best) { best = v; picks = [m]; } else if (v === best) picks.push(m);
    }
    return picks[Math.floor(Math.random() * picks.length)];
  },
};

function run(cfg, strat) {
  const N = cfg.players;
  const winShare = new Array(N).fill(0);
  let moves = 0, captures = 0, extra = 0, ties = 0, leftover = 0, maxPit = 0, maxStore = 0, spread = 0, maxMoves = 0;
  const total = N * cfg.pits * cfg.seeds;
  for (let k = 0; k < GAMES; k++) {
    const g = createGame(cfg);
    while (!g.over) {
      const r = applyMove(g, strategies[strat](g));
      if (r.capture) captures++;
      if (r.extraTurn) extra++;
      for (let i = 0; i < g.board.length; i++) {
        const v = g.board[i];
        if (i % (cfg.pits + 1) === cfg.pits) maxStore = Math.max(maxStore, v); else maxPit = Math.max(maxPit, v);
      }
      if (r.sweep) leftover += r.sweep.reduce((a, b) => a + b, 0) / total;
    }
    moves += g.moveCount;
    maxMoves = Math.max(maxMoves, g.moveCount);
    const s = scores(g);
    const top = Math.max(...s);
    const winners = s.map((v, i) => (v === top ? i : -1)).filter((i) => i >= 0);
    if (winners.length > 1) ties++;
    winners.forEach((w) => (winShare[w] += 1 / winners.length));
    spread += top - Math.min(...s);
  }
  const pct = (x) => (100 * x / GAMES).toFixed(1);
  return {
    설정: cfg.label,
    전략: strat,
    자리별승률: winShare.map(pct).join(' / '),
    평균수: (moves / GAMES).toFixed(1),
    예상분: ((moves / GAMES) * SEC_PER_MOVE / 60).toFixed(1),
    최대수: maxMoves,
    캡처: (captures / GAMES).toFixed(1),
    추가턴: (extra / GAMES).toFixed(1),
    종료시보드잔여: (100 * leftover / GAMES).toFixed(1) + '%',
    동점: pct(ties) + '%',
    '1위-꼴찌': (spread / GAMES).toFixed(1),
    칸최대: maxPit,
    저장고최대: maxStore,
  };
}

const B = { players: 4, pits: 5, seeds: 4 };
const F = (b) => ({ ...B, noExtraMoves: 2, storeBonus: b, label: `F. 1·2번 첫수 추가턴 없음 + ${b.join('/')}` });
const configs = [
  { ...B, noExtraMoves: 2, label: 'F. 1·2번 첫수 추가턴 없음 (점수 보정 없음)' },
  F([0, 1, 0, 0]), F([0, 1, 0, 1]), F([0, 1, 1, 1]), F([0, 2, 1, 1]),
];
const rows = [];
for (const cfg of configs) for (const s of Object.keys(strategies)) rows.push(run(cfg, s));
console.table(rows);
