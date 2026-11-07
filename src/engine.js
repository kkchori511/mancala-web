// 만칼라 룰 엔진 (2인·4인 공용)
// 보드는 하나의 고리 배열이다. 플레이어 p의 칸: base(p)..base(p)+pits-1, 저장고: base(p)+pits
// 분배 방향은 인덱스 증가 방향(반시계)이며, 다른 사람의 저장고는 건너뛴다.

// noExtraMoves: 게임 처음 n수 동안은 추가 턴 없음 (선 차례 보정)
// storeBonus: 자리별 시작 점수 (선 차례 보정)
export function createGame({ players = 2, pits = 6, seeds = 4, noExtraMoves = 0, storeBonus = null, start = 0 } = {}) {
  const size = players * (pits + 1);
  const board = new Array(size).fill(0);
  for (let p = 0; p < players; p++) {
    for (let i = 0; i < pits; i++) board[p * (pits + 1) + i] = seeds;
  }
  if (storeBonus) for (let p = 0; p < players; p++) board[p * (pits + 1) + pits] = storeBonus[p] ?? 0;
  return { players, pits, seeds, board, current: start, start, over: false, moveCount: 0, noExtraMoves };
}

export const base = (g, p) => p * (g.pits + 1);
export const storeIndex = (g, p) => base(g, p) + g.pits;
export const ownerOf = (g, idx) => Math.floor(idx / (g.pits + 1));
export const isStore = (g, idx) => idx % (g.pits + 1) === g.pits;

// 맞은편 칸: 2인은 상대, 4인은 정면에 앉은 사람의 마주 보는 칸
export function oppositeIndex(g, idx) {
  const p = ownerOf(g, idx);
  const local = idx - base(g, p);
  const q = (p + Math.floor(g.players / 2)) % g.players;
  return base(g, q) + (g.pits - 1 - local);
}

export function legalMoves(g, p = g.current) {
  const moves = [];
  for (let i = 0; i < g.pits; i++) if (g.board[base(g, p) + i] > 0) moves.push(i);
  return moves;
}

const sideEmpty = (g, p) => legalMoves(g, p).length === 0;

// 수를 둔다. 결과 이벤트를 돌려준다(화면 효과·소리에 사용).
export function applyMove(g, localPit) {
  if (g.over) throw new Error('game over');
  const p = g.current;
  let idx = base(g, p) + localPit;
  let hand = g.board[idx];
  if (hand === 0) throw new Error('empty pit');
  g.board[idx] = 0;
  const path = [];
  const myStore = storeIndex(g, p);
  while (hand > 0) {
    idx = (idx + 1) % g.board.length;
    if (isStore(g, idx) && idx !== myStore) continue;
    g.board[idx]++;
    hand--;
    path.push(idx);
  }
  const result = { player: p, pit: localPit, path, extraTurn: false, capture: null, sweep: null };
  const last = idx;

  if (last === myStore) {
    result.extraTurn = g.moveCount >= (g.noExtraMoves ?? 0);
  } else if (ownerOf(g, last) === p && g.board[last] === 1) {
    const opp = oppositeIndex(g, last);
    if (g.board[opp] > 0) {
      const taken = g.board[opp];
      result.capture = { at: last, from: opp, victim: ownerOf(g, opp), taken, total: taken + 1 };
      g.board[myStore] += taken + 1;
      g.board[opp] = 0;
      g.board[last] = 0;
    }
  }
  g.moveCount++;

  // 종료: 누구든 자기 칸이 모두 비면 즉시 끝, 남은 공은 각자 저장고로
  let ended = false;
  for (let q = 0; q < g.players; q++) if (sideEmpty(g, q)) ended = true;
  if (ended) {
    g.over = true;
    result.sweep = [];
    for (let q = 0; q < g.players; q++) {
      let sum = 0;
      for (let i = 0; i < g.pits; i++) {
        sum += g.board[base(g, q) + i];
        g.board[base(g, q) + i] = 0;
      }
      g.board[storeIndex(g, q)] += sum;
      result.sweep.push(sum);
    }
  } else if (!result.extraTurn) {
    g.current = (p + 1) % g.players;
  }
  return result;
}

export const scores = (g) => Array.from({ length: g.players }, (_, p) => g.board[storeIndex(g, p)]);

export function cloneGame(g) {
  return { ...g, board: g.board.slice() };
}

// 4인 보정 규칙을 적용한 설정. 시작하는 사람 기준으로 1·2번째 사람의 첫 수는 추가 턴 없음, 2번째 사람 1점.
export function fourPlayerConfig(start = 0, balance = true) {
  const cfg = { players: 4, pits: 5, seeds: 4, start };
  if (balance) {
    cfg.noExtraMoves = 2;
    cfg.storeBonus = [0, 0, 0, 0];
    cfg.storeBonus[(start + 1) % 4] = 1;
  }
  return cfg;
}

export const twoPlayerConfig = (start = 0) => ({ players: 2, pits: 6, seeds: 4, start });

// 이어 하기 저장용
export const serialize = (g) => JSON.stringify(g);
export const deserialize = (str) => JSON.parse(str);
