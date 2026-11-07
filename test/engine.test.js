import assert from 'node:assert/strict';
import { createGame, applyMove, scores, fourPlayerConfig, twoPlayerConfig, oppositeIndex, base } from '../src/engine.js';
import { chooseMove } from '../src/ai.js';

let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok -', name); };

t('2인 초기 상태: 칸마다 4개, 저장고 0', () => {
  const g = createGame(twoPlayerConfig());
  assert.deepEqual(g.board, [4,4,4,4,4,4,0, 4,4,4,4,4,4,0]);
});

t('추가 턴: 3번째 칸(인덱스 2)의 4개는 저장고에서 끝남', () => {
  const g = createGame(twoPlayerConfig());
  const r = applyMove(g, 2);
  assert.equal(r.extraTurn, true);
  assert.equal(g.current, 0);
  assert.equal(g.board[6], 1);
});

t('상대 저장고는 건너뜀', () => {
  const g = createGame(twoPlayerConfig());
  g.board = [0,0,0,0,0,10, 0, 0,0,0,0,0,1, 0];
  const r = applyMove(g, 5);
  assert.equal(g.board[13], 0);
  assert.ok(!r.path.includes(13));
});

t('캡처: 내 빈 칸에 마지막 공 + 맞은편에 공 있음', () => {
  const g = createGame(twoPlayerConfig());
  g.board = [1,0,0,0,0,1, 0, 2,2,2,2,5,2, 0];
  // 0번 칸 1개 → 1번 칸(빈 칸)에 떨어짐, 맞은편 인덱스 11(5개)
  const r = applyMove(g, 0);
  assert.equal(oppositeIndex(g, 1), 11);
  assert.ok(r.capture);
  assert.equal(r.capture.total, 6);
  assert.equal(g.board[6], 6);
  assert.equal(g.board[11], 0);
});

t('캡처 없음: 맞은편이 비어 있으면 공은 그대로', () => {
  const g = createGame(twoPlayerConfig());
  g.board = [1,0,0,0,0,1, 0, 2,2,2,2,0,2, 0];
  const r = applyMove(g, 0);
  assert.equal(r.capture, null);
  assert.equal(g.board[1], 1);
  assert.equal(g.current, 1);
});

t('종료: 한쪽이 비면 남은 공은 각자 저장고로', () => {
  const g = createGame(twoPlayerConfig());
  g.board = [0,0,0,0,0,1, 10, 1,0,0,0,0,3, 20];
  const r = applyMove(g, 5);
  assert.equal(g.over, true);
  assert.deepEqual(scores(g), [11, 24]);
  assert.deepEqual(r.sweep, [0, 4]);
});

t('4인 보정: 시작 2번(인덱스 2)이면 3번 자리(인덱스 3)가 1점', () => {
  const g = createGame(fourPlayerConfig(2));
  assert.equal(g.current, 2);
  assert.deepEqual(scores(g), [0, 0, 0, 1]);
});

t('4인 보정: 첫 두 수는 추가 턴 없음, 세 번째 수부터 가능', () => {
  const g = createGame(fourPlayerConfig(0));
  // 인덱스 1 칸의 4개 → 저장고에서 끝남(5칸 기준)
  let r = applyMove(g, 1); assert.equal(r.extraTurn, false); assert.equal(g.current, 1);
  r = applyMove(g, 1); assert.equal(r.extraTurn, false); assert.equal(g.current, 2);
  r = applyMove(g, 1); assert.equal(r.extraTurn, true); assert.equal(g.current, 2);
});

t('4인 맞은편: P1 1번째 칸 ↔ P3 5번째 칸', () => {
  const g = createGame(fourPlayerConfig(0));
  assert.equal(oppositeIndex(g, base(g, 0) + 0), base(g, 2) + 4);
});

t('공 총수 보존 (무작위 200판)', () => {
  for (let k = 0; k < 200; k++) {
    const g = createGame(k % 2 ? fourPlayerConfig(k % 4) : twoPlayerConfig(k % 2));
    const total = g.board.reduce((a, b) => a + b, 0);
    while (!g.over) {
      const moves = []; for (let i = 0; i < g.pits; i++) if (g.board[base(g, g.current) + i]) moves.push(i);
      applyMove(g, moves[Math.floor(Math.random() * moves.length)]);
      assert.equal(g.board.reduce((a, b) => a + b, 0), total);
    }
  }
});

t('컴퓨터: 보통이 쉬움을 대부분 이김 (40판)', () => {
  let normalWins = 0;
  for (let k = 0; k < 40; k++) {
    const g = createGame(twoPlayerConfig(k % 2));
    const lvl = (k % 4 < 2) ? ['normal', 'easy'] : ['easy', 'normal'];
    const normalSeat = lvl.indexOf('normal');
    while (!g.over) applyMove(g, chooseMove(g, lvl[g.current]));
    const s = scores(g); if (s[normalSeat] > s[1 - normalSeat]) normalWins++;
  }
  console.log('   보통 승:', normalWins, '/ 40');
  assert.ok(normalWins >= 28);
});

console.log(`\n${n}개 통과`);
