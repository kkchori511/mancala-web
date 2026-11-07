// 컴퓨터 상대 (2인용). easy: 욕심형 + 약간의 무작위, normal: 알파베타 탐색
import { legalMoves, applyMove, cloneGame, storeIndex } from './engine.js';

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function greedy(g) {
  let best = -Infinity, picks = [];
  for (const m of legalMoves(g)) {
    const c = cloneGame(g);
    const before = c.board[storeIndex(c, g.current)];
    const r = applyMove(c, m);
    const v = c.board[storeIndex(c, g.current)] - before + (r.extraTurn ? 1.5 : 0);
    if (v > best) { best = v; picks = [m]; } else if (v === best) picks.push(m);
  }
  return pickRandom(picks);
}

function evaluate(g, me) {
  const opp = 1 - me;
  return g.board[storeIndex(g, me)] - g.board[storeIndex(g, opp)];
}

function search(g, depth, alpha, beta, me) {
  if (depth === 0 || g.over) return evaluate(g, me);
  const maximizing = g.current === me;
  let best = maximizing ? -Infinity : Infinity;
  for (const m of legalMoves(g)) {
    const c = cloneGame(g);
    const r = applyMove(c, m);
    // 추가 턴이면 깊이를 줄이지 않음(같은 사람이 이어서 둠)
    const v = search(c, r.extraTurn ? depth : depth - 1, alpha, beta, me);
    if (maximizing) { best = Math.max(best, v); alpha = Math.max(alpha, v); }
    else { best = Math.min(best, v); beta = Math.min(beta, v); }
    if (beta <= alpha) break;
  }
  return best;
}

function minimax(g, depth = 6) {
  const me = g.current;
  let best = -Infinity, picks = [];
  for (const m of legalMoves(g)) {
    const c = cloneGame(g);
    const r = applyMove(c, m);
    const v = search(c, r.extraTurn ? depth : depth - 1, -Infinity, Infinity, me);
    if (v > best) { best = v; picks = [m]; } else if (v === best) picks.push(m);
  }
  return pickRandom(picks);
}

export function chooseMove(g, level = 'normal') {
  if (level === 'easy') return Math.random() < 0.3 ? pickRandom(legalMoves(g)) : greedy(g);
  return minimax(g, 6);
}
