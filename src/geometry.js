// 화면 배치(좌표) 계산. 모든 값은 SVG viewBox 좌표.
// 결과: { vb:{w,h}, board:{x,y,w,h,rx}, cells:[인덱스별 칸/저장고], arrows:[], badges:[], center:{x,y}, seatAngle:[...] }
// cell: { kind:'pit'|'store', owner, shape:{kind:'circle'|'rect',...}, score?:{x,y,w,h,rot}, hit:{x,y,w,h} }

const circle = (cx, cy, r) => ({ kind: 'circle', cx, cy, r });
const rect = (x, y, w, h, rx) => ({ kind: 'rect', x, y, w, h, rx });
export const shapeCenter = (sh) => (sh.kind === 'circle' ? [sh.cx, sh.cy] : [sh.x + sh.w / 2, sh.y + sh.h / 2]);

// 2인 가로: 아래 줄 = P1(인덱스 0~5, 왼→오), 오른쪽 저장고 6 = P1, 위 줄 = P2(7~12, 오→왼), 왼쪽 저장고 13 = P2
export function layout2pLandscape() {
  const vb = { w: 1600, h: 720 };
  const board = { x: 20, y: 20, w: 1560, h: 680, rx: 90 };
  const cells = [];
  const colX = (c) => 375 + c * 170;
  const r = 76, topY = 228, botY = 492;
  for (let i = 0; i < 6; i++) cells[i] = { kind: 'pit', owner: 0, shape: circle(colX(i), botY, r) };
  for (let i = 0; i < 6; i++) cells[7 + i] = { kind: 'pit', owner: 1, shape: circle(colX(5 - i), topY, r) };
  // 저장고: 공이 들어오는 쪽에 공 칸. P1(오른쪽)은 아래에서 들어옴 → 위 점수, 아래 공. P2(왼쪽)는 반대(점대칭)
  const sw = 196, sy = 72, sh = 576, split = 0.3;
  cells[6] = {
    kind: 'store', owner: 0, frame: rect(1340, sy, sw, sh, 56),
    shape: rect(1350, sy + sh * split + 6, sw - 20, sh * (1 - split) - 16, 46),
    score: { x: 1350, y: sy + 10, w: sw - 20, h: sh * split - 14, rot: 0 },
  };
  cells[13] = {
    kind: 'store', owner: 1, frame: rect(64, sy, sw, sh, 56),
    shape: rect(74, sy + 10, sw - 20, sh * (1 - split) - 16, 46),
    score: { x: 74, y: sy + sh * (1 - split) + 4, w: sw - 20, h: sh * split - 14, rot: 180 },
  };
  const arrows = [
    [300, 678, 1300, 678], // 아래 →
    [1558, 620, 1558, 100], // 오른쪽 ↑
    [1300, 42, 300, 42], // 위 ←
    [42, 100, 42, 620], // 왼쪽 ↓
  ];
  return { vb, board, cells, arrows, center: { x: 800, y: 360 }, seatAngle: [0, 180], kind: '2p-land' };
}

// 2인 세로(스마트폰): view 플레이어가 아래. 왼쪽 열 = view의 칸(위→아래), 아래 저장고 = view
export function layout2pPortrait(view = 0) {
  const vb = { w: 720, h: 1560 };
  const board = { x: 16, y: 16, w: 688, h: 1528, rx: 80 };
  const cells = [];
  const other = 1 - view;
  const r = 76, lx = 214, rx = 506;
  const rowY = (i) => 375 + i * 162;
  const vb0 = view * 7, ob0 = other * 7;
  for (let i = 0; i < 6; i++) cells[vb0 + i] = { kind: 'pit', owner: view, shape: circle(lx, rowY(i), r) };
  for (let i = 0; i < 6; i++) cells[ob0 + i] = { kind: 'pit', owner: other, shape: circle(rx, rowY(5 - i), r) };
  const sx = 56, sw = 608, sh = 210, split = 0.32;
  // 아래(view): 왼쪽 공, 오른쪽 점수. 위(상대): 왼쪽 점수, 오른쪽 공 (점대칭)
  const by = 1300;
  cells[vb0 + 6] = {
    kind: 'store', owner: view, frame: rect(sx, by, sw, sh, 60),
    shape: rect(sx + 10, by + 10, sw * (1 - split) - 16, sh - 20, 50),
    score: { x: sx + sw * (1 - split) + 4, y: by + 10, w: sw * split - 14, h: sh - 20, rot: 0 },
  };
  const ty = 50;
  cells[ob0 + 6] = {
    kind: 'store', owner: other, frame: rect(sx, ty, sw, sh, 60),
    shape: rect(sx + sw * split + 6, ty + 10, sw * (1 - split) - 16, sh - 20, 50),
    score: { x: sx + 10, y: ty + 10, w: sw * split - 14, h: sh - 20, rot: 0 },
  };
  const arrows = [
    [38, 300, 38, 1250], // 왼쪽 ↓ (view 칸 방향)
    [120, 1524, 600, 1524], // 아래 →
    [682, 1250, 682, 300], // 오른쪽 ↑
    [600, 36, 120, 36], // 위 ←
  ];
  return { vb, board, cells, arrows, center: { x: 360, y: 780 }, seatAngle: [0, 0], kind: '2p-port', view };
}

// 4인: 정사각형 보드. P1 아래(왼→오) 저장고 오른쪽 아래, P2 오른쪽(아래→위) 저장고 오른쪽 위,
// P3 위(오→왼) 저장고 왼쪽 위, P4 왼쪽(위→아래) 저장고 왼쪽 아래.
export function layout4p(mode = 'tablet') {
  const vb = mode === 'tablet' ? { w: 1440, h: 1080 } : { w: 1920, h: 1080 };
  const S = 1000, bx = (vb.w - S) / 2, by = 40;
  const board = { x: bx, y: by, w: S, h: S, rx: 44 };
  const m = 38, c = 190, g = 12;
  const inner = S - 2 * m;
  const pw = (inner - 2 * c - 6 * g) / 5, pd = c;
  const x0 = bx + m, y0 = by + m, x1 = bx + S - m, y1 = by + S - m;
  const pr = 22;
  const cells = [];
  const P = 6; // pits + store 단위(5칸 + 저장고)
  for (let i = 0; i < 5; i++) {
    const along = c + g + i * (pw + g);
    cells[0 * P + i] = { kind: 'pit', owner: 0, shape: rect(x0 + along, y1 - pd, pw, pd, pr) };
    cells[1 * P + i] = { kind: 'pit', owner: 1, shape: rect(x1 - pd, y1 - along - pw, pd, pw, pr) };
    cells[2 * P + i] = { kind: 'pit', owner: 2, shape: rect(x1 - along - pw, y0, pw, pd, pr) };
    cells[3 * P + i] = { kind: 'pit', owner: 3, shape: rect(x0, y0 + along, pd, pw, pr) };
  }
  const storeXY = [[x1 - c, y1 - c], [x1 - c, y0], [x0, y0], [x0, y1 - c]];
  storeXY.forEach(([x, y], p) => {
    cells[p * P + 5] = { kind: 'store', owner: p, frame: rect(x, y, c, c, 34), shape: rect(x + 8, y + 8, c - 16, c - 16, 28), tint: true };
  });
  const L0 = c + g, L1 = inner - c - g; // 화살표는 칸 구간 전체
  const arrows = [
    [x0 + L0, by + S - m / 2, x0 + L1, by + S - m / 2], // 아래 →
    [bx + S - m / 2, y0 + L1, bx + S - m / 2, y0 + L0], // 오른쪽 ↑
    [x0 + L1, by + m / 2, x0 + L0, by + m / 2], // 위 ←
    [bx + m / 2, y0 + L0, bx + m / 2, y0 + L1], // 왼쪽 ↓
  ];
  // 바깥 배지: 각자 저장고 쪽 모서리 바깥 좌우 빈 공간
  const side = bx;
  const seatAngle = mode === 'tablet' ? [0, -90, 180, 90] : [0, 0, 0, 0];
  const bw = Math.min(side * 0.78, 250), bh = 96;
  const badges = [
    { x: bx + S + side * 0.45, y: by + S - c / 2, dir: [0, 1] },
    { x: bx + S + side * 0.42, y: by + c / 2, dir: [1, 0] },
    { x: bx - side * 0.45, y: by + c / 2, dir: [0, -1] },
    { x: bx - side * 0.42, y: by + S - c / 2, dir: [-1, 0] },
  ].map((b, p) => ({ ...b, w: bw, h: bh, rot: seatAngle[p] }));
  const center = { x: bx + S / 2, y: by + S / 2 };
  const log = mode === 'monitor' ? { x: bx + S + side * 0.1, y: by + c + 70, w: side * 0.8, h: S - 2 * c - 140 } : null;
  return { vb, board, cells, arrows, badges, center, seatAngle, log, kind: '4p-' + mode, centerSize: inner - 2 * pd };
}
