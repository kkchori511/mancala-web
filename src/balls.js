// 당구공 SVG 그리기와 칸 안 배치 계산
// 1~10번: 모두 다른 색, 11~20 흰 줄 1개, 21~30 줄 2개, 31~40 줄 3개, 41+ 줄 4개. 0번 = 이동 중인 흰 공

export const BALL_COLORS = ['#F2C200', '#1F4FB8', '#D2232A', '#5B2C8F', '#F07A12', '#12804A', '#7A1E2B', '#1A1A1A', '#E9579B', '#3FB4E5'];

// 공 광택·그림자용 공용 정의 (보드 SVG에 한 번만 넣음)
export const BALL_DEFS = `
  <radialGradient id="ballShine" cx="35%" cy="30%" r="75%">
    <stop offset="0" stop-color="#fff" stop-opacity=".6"/>
    <stop offset=".35" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".45"/>
  </radialGradient>`;

// 원 안의 가로 띠(y1~y2) 경로. 원 중심 기준 좌표
function bandPath(r, y1, y2) {
  const x1 = Math.sqrt(Math.max(r * r - y1 * y1, 0));
  const x2 = Math.sqrt(Math.max(r * r - y2 * y2, 0));
  return `M${-x1},${y1} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} L${-x2},${y2} A${r},${r} 0 0 1 ${-x1},${y1} Z`;
}

const f = (v) => Math.round(v * 10) / 10;

/**
 * 공 하나. (cx, cy) 중심, r 반지름.
 * opts.top: 맨 위 공 강조(흰 테두리), opts.dim: 아랫층(어둡게, 0~1)
 */
export function ballSVG(n, cx, cy, r, opts = {}) {
  const base = n === 0 ? '#F6F3EA' : BALL_COLORS[(n - 1) % 10];
  const stripes = n === 0 ? 0 : Math.min(4, Math.floor((n - 1) / 10));
  let s = `<g transform="translate(${f(cx)},${f(cy)})">`;
  s += `<ellipse cx="${f(r * 0.12)}" cy="${f(r * 0.88)}" rx="${f(r * 0.85)}" ry="${f(r * 0.25)}" fill="#000" opacity=".2"/>`;
  if (opts.top) s += `<circle r="${f(r + Math.max(2, r * 0.07))}" fill="#fff" opacity=".9"/>`;
  s += `<circle r="${f(r)}" fill="${base}"/>`;
  if (stripes) {
    const h = r * 0.2;
    for (let i = 0; i < stripes; i++) {
      const y = -r + (2 * r * (i + 1)) / (stripes + 1);
      s += `<path d="${bandPath(r, y - h / 2, y + h / 2)}" fill="#fff"/>`;
    }
  }
  if (n > 0 && !opts.dim) {
    const big = opts.top;
    const fs = big ? (n >= 10 ? r * 0.74 : r * 0.92) : (n >= 10 ? r * 0.52 : r * 0.64);
    s += `<circle r="${f(r * (big ? 0.64 : 0.47))}" fill="#fff"/>`;
    // numRot: 번호를 돌려 보여 줄 각도(상대가 읽도록). 뒤집히면 6·9 구분 밑줄
    const rot = opts.numRot || 0;
    const mark = rot === 180 && /[69]/.test(String(n))
      ? `<rect x="${f(-fs * 0.3)}" y="${f(fs * 0.46)}" width="${f(fs * 0.6)}" height="${f(Math.max(1.5, fs * 0.08))}" rx="1" fill="#111"/>` : '';
    s += `<g${rot ? ` transform="rotate(${rot})"` : ''}><text y="${f(fs * 0.36)}" text-anchor="middle" font-size="${f(fs)}" class="ball-num">${n}</text>${mark}</g>`;
  }
  s += `<circle r="${f(r)}" fill="url(#ballShine)"/>`;
  if (opts.dim) s += `<circle r="${f(r)}" fill="#2a1a0a" opacity="${opts.dim}"/>`;
  return s + '</g>';
}

/**
 * 칸 하나에 쌓인 공 배치. 맨 위(최고 번호) 공이 가운데에 크게.
 * shape: {kind:'circle', cx, cy, r} 또는 {kind:'rect', x, y, w, h}
 * maxTop: 윗층에 보일 최대 개수(가운데 1 + 둘레), 넘는 공은 아랫층에 어둡게 비침
 */
export function pileSVG(count, shape, opts = {}) {
  if (!count) return '';
  let s = '';
  if (shape.kind === 'circle') {
    // 가운데 공 지름 = 칸 지름의 70%(면적 약 50%). 나머지는 뒤 둘레로 살짝 보임(최대 6개)
    const { cx, cy, r: R } = shape;
    const bigR = R * 0.7, b = R * 0.27;
    const k = Math.min(count - 1, 6);
    for (let i = 0; i < k; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(k, 1) + (k === 1 ? Math.PI / 4 : 0);
      s += ballSVG(count - k + i, cx + Math.cos(a) * R * 0.66, cy + Math.sin(a) * R * 0.66, b);
    }
    s += ballSVG(count, cx, cy, bigR, { top: true, numRot: opts.topRot || 0 });
    return s;
  }

  // 직사각형: 맨 위 공을 가운데 크게, 나머지는 긴 방향 앞뒤로 대칭 정돈
  const { x, y, w, h } = shape;
  const cx = x + w / 2, cy = y + h / 2;
  const tall = h >= w;
  const short = Math.min(w, h), long = Math.max(w, h);
  const bigR = short * (opts.bigScale ?? 0.45);
  const smallR = short * (opts.smallScale ?? 0.21);
  const toXY = ([u, v]) => (tall ? [cx + v, cy + u] : [cx + u, cy + v]);
  let slots = [];
  if (long / short < 1.3) {
    // 정사각형(4인 저장고): 둘레에 링
    const ringR = short / 2 - smallR * 1.15;
    const nRing = Math.max(6, Math.floor((2 * Math.PI * ringR) / (smallR * 2.1)));
    for (let i = 0; i < nRing; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / nRing;
      slots.push([Math.sin(a) * ringR, -Math.cos(a) * ringR]);
    }
  } else {
    // 긴 방향 u, 짧은 방향 v. 행마다 v = ±s 두 개, 가운데 공 바로 앞뒤 행부터 바깥으로
    const s2 = Math.min(short / 2 - smallR * 1.05, smallR * 1.15);
    const maxU = long / 2 - smallR * 1.05;
    const rowsU = [];
    for (let u = Math.min(bigR + smallR * 0.55, maxU); u <= maxU + 0.01; u += smallR * 2.05) rowsU.push(u);
    const need = count - 1;
    if (need === 1) slots = [[-rowsU[0], 0]];
    else if (need === 2) slots = [[-rowsU[0], 0], [rowsU[0], 0]];
    else if (need === 3) slots = [[-rowsU[0], -s2], [-rowsU[0], s2], [rowsU[0], 0]];
    else for (const u of rowsU) slots.push([-u, -s2], [-u, s2], [u, -s2], [u, s2]);
  }
  const shownSmall = Math.min(count - 1, slots.length, opts.maxSmall ?? 99);
  const startNum = count - shownSmall;
  for (let i = 0; i < shownSmall; i++) {
    const [px, py] = toXY(slots[i]);
    s += ballSVG(startNum + i, px, py, smallR);
  }
  s += ballSVG(count, cx, cy, bigR, { top: true, numRot: opts.topRot || 0 });
  return s;
}
