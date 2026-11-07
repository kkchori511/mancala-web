// 보드 SVG 그리기와 애니메이션
import { BALL_DEFS, ballSVG, pileSVG } from './balls.js';
import { shapeCenter } from './geometry.js';

const NS = 'http://www.w3.org/2000/svg';
export const PLAYER_COLORS = ['#2a9d8f', '#e9806e', '#3d4e7a', '#93b94a'];

const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function shapeSVG(sh, attrs) {
  return sh.kind === 'circle'
    ? `<circle cx="${sh.cx}" cy="${sh.cy}" r="${sh.r}" ${attrs}/>`
    : `<rect x="${sh.x}" y="${sh.y}" width="${sh.w}" height="${sh.h}" rx="${sh.rx}" ${attrs}/>`;
}

export class BoardView {
  constructor(host, { layout, players, names, settings, upright = false }) {
    this.host = host;
    this.L = layout;
    this.players = players;
    this.names = names;
    this.settings = settings;
    this.counts = [];
    this.upright = upright; // 온라인: 모든 글자를 내 방향으로
    this.pitRot = 0; // 2인: 가운데 칸 번호 방향(차례인 사람 쪽)
    this.active = -1;
    this.onCell = null;
    this.logLines = [];
    this.build();
  }

  build() {
    const { vb, board, cells, arrows } = this.L;
    const is4 = this.players === 4;
    let s = `<svg xmlns="${NS}" viewBox="0 0 ${vb.w} ${vb.h}" preserveAspectRatio="xMidYMid meet" class="board-svg">
    <defs>${BALL_DEFS}
      <pattern id="oak" patternUnits="userSpaceOnUse" width="512" height="512"><image href="assets/oak-tile.jpg" width="512" height="512" preserveAspectRatio="none"/></pattern>
      <radialGradient id="pitShade" cx="50%" cy="42%" r="62%">
        <stop offset="0" stop-color="#000" stop-opacity=".02"/><stop offset=".78" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></radialGradient>
      <linearGradient id="rimLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient>
      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="beamGlow" filterUnits="userSpaceOnUse" x="-500" y="-500" width="3000" height="3000"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="boardShadow" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#5a4630" flood-opacity=".22"/></filter>
      <marker id="arrowHead" markerUnits="userSpaceOnUse" markerWidth="22" markerHeight="22" refX="18" refY="11" orient="auto"><path d="M2,3 L20,11 L2,19" fill="none" stroke="#222" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></marker>
    </defs>
    <g class="board-base" filter="url(#boardShadow)">
      <rect x="${board.x}" y="${board.y}" width="${board.w}" height="${board.h}" rx="${board.rx}" fill="#eadfcd"/>
      <rect x="${board.x}" y="${board.y}" width="${board.w}" height="${board.h}" rx="${board.rx}" fill="url(#oak)"/>
      <rect x="${board.x + 3}" y="${board.y + 3}" width="${board.w - 6}" height="${board.h - 6}" rx="${board.rx - 3}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
    </g>
    <g class="arrows" ${this.settings.arrows ? '' : 'style="display:none"'}>
      ${arrows.map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#222" stroke-width="3" stroke-linecap="round" marker-end="url(#arrowHead)"/>`).join('')}
    </g>
    <g class="center-layer"></g>`;
    cells.forEach((cell, i) => {
      if (!cell) return;
      const fr = cell.frame;
      s += `<g class="cell ${cell.kind}" data-i="${i}" data-owner="${cell.owner}">`;
      if (cell.kind === 'store') {
        s += `<g class="store-glow"></g>`;
        s += shapeSVG(fr, 'fill="#e6d8bf"');
        s += shapeSVG(fr, 'fill="url(#oak)" opacity=".55"');
        if (cell.tint) s += shapeSVG(fr, `fill="${PLAYER_COLORS[cell.owner]}" opacity=".3"`);
        s += shapeSVG(cell.shape, `fill="${cell.tint ? PLAYER_COLORS[cell.owner] : '#d9c6a6'}" opacity="${cell.tint ? 0.18 : 0.75}"`);
        s += shapeSVG(cell.shape, 'fill="url(#pitShade)"');
        if (cell.score) {
          const sc = cell.score;
          s += `<rect x="${sc.x}" y="${sc.y}" width="${sc.w}" height="${sc.h}" rx="${Math.min(sc.w, sc.h) * 0.3}" fill="#f3ead9" stroke="#d8c7aa" stroke-width="2"/>`;
          s += `<g class="score-text"></g>`;
        }
      } else {
        s += shapeSVG(cell.shape, 'fill="#dccaa9"');
        s += shapeSVG(cell.shape, 'fill="url(#oak)" opacity=".45"');
        s += shapeSVG(cell.shape, 'fill="url(#pitShade)"');
        s += shapeSVG(cell.shape, 'fill="url(#rimLight)" opacity=".7"');
      }
      s += `<g class="sel"></g><g class="pile"></g><g class="mark"></g>`;
      // 누르는 영역 (투명)
      s += shapeSVG(cell.kind === 'store' ? fr : cell.shape, 'class="hit" fill="transparent"');
      s += `</g>`;
    });
    if (is4) s += `<g class="badges"></g>`;
    if (this.L.log) s += `<g class="log"></g>`;
    s += `<g class="fx"></g><g class="fly"></g></svg>`;
    this.host.innerHTML = s;
    this.svg = this.host.querySelector('svg');
    this.fx = this.svg.querySelector('.fx');
    this.fly = this.svg.querySelector('.fly');
    this.cellEls = [];
    this.svg.querySelectorAll('.cell').forEach((el) => { this.cellEls[+el.dataset.i] = el; });
    this.svg.addEventListener('click', (e) => {
      const el = e.target.closest('.cell');
      if (el && this.onCell) this.onCell(+el.dataset.i, el);
    });
    if (is4) this.buildBadges();
    if (this.L.log) this.renderLog();
  }

  buildBadges() {
    const g = this.svg.querySelector('.badges');
    const tablet = this.L.kind === '4p-tablet';
    g.innerHTML = this.L.badges.map((b, p) => {
      const { x, y, w, h, rot } = b;
      const col = PLAYER_COLORS[p];
      let chev = '';
      if (tablet) {
        const [dx, dy] = b.dir;
        const reach = h / 2 + 16, t = 11, a = Math.atan2(dy, dx);
        for (let k = 0; k < 3; k++) {
          const px = x + dx * (reach + k * 19), py = y + dy * (reach + k * 19);
          const pts = [[t, 0], [-t * 0.7, -t], [-t * 0.7, t]].map(([u, v]) => `${px + u * Math.cos(a) - v * Math.sin(a)},${py + u * Math.sin(a) + v * Math.cos(a)}`);
          chev += `<polygon points="${pts.join(' ')}" fill="${col}" opacity="${0.9 - k * 0.25}"/>`;
        }
      }
      const nm = esc(this.names[p]).slice(0, 6);
      return `<g class="badge" data-p="${p}">
        ${chev}
        <g transform="rotate(${rot} ${x} ${y})">
          <rect class="badge-glow" x="${x - w / 2 - 7}" y="${y - h / 2 - 7}" width="${w + 14}" height="${h + 14}" rx="${h / 2 + 7}" fill="none" stroke="${col}" stroke-width="6" filter="url(#glow)" opacity="0"/>
          <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${col}"/>
          <text x="${x - w * 0.2}" y="${y + h * 0.15}" text-anchor="middle" font-size="${nm.length > 3 ? h * 0.3 : h * 0.4}" class="badge-name">${nm}</text>
          <rect x="${x + w * 0.04}" y="${y - h * 0.36}" width="${w * 0.42}" height="${h * 0.72}" rx="${h * 0.36}" fill="#fff"/>
          <text class="badge-score" x="${x + w * 0.25}" y="${y + h * 0.17}" text-anchor="middle" font-size="${h * 0.46}">0</text>
        </g></g>`;
    }).join('');
  }

  // 2인: 가운데 칸 번호를 플레이어 p가 읽는 방향으로
  facePits(p) {
    const r = this.textRot(p);
    if (r === this.pitRot) return;
    this.pitRot = r;
    this.L.cells.forEach((c, i) => { if (c?.kind === 'pit') this.setCount(i, this.counts[i]); });
  }

  // 전체 개수 반영
  setAll(counts) {
    counts.forEach((n, i) => this.setCount(i, n));
  }

  setCount(i, n) {
    this.counts[i] = n;
    const cell = this.L.cells[i];
    const el = this.cellEls[i];
    if (!cell || !el) return;
    const opts = this.players === 4 ? { bigScale: 0.45, smallScale: 0.22 } : {};
    if (cell.kind === 'store') Object.assign(opts, this.players === 4 ? { bigScale: 0.36, smallScale: 0.14 } : { bigScale: 0.44, smallScale: 0.19 });
    // 2인 저장고: 가운데 공 번호는 상대 방향(점수 칸은 주인 방향)
    if (cell.kind === 'store' && this.players === 2) opts.topRot = this.textRot(1 - cell.owner);
    if (cell.kind === 'pit' && this.players === 2) opts.topRot = this.pitRot;
    el.querySelector('.pile').innerHTML = pileSVG(n, cell.shape, opts);
    if (cell.kind === 'store') this.setScore(cell.owner, n);
  }

  setScore(p, n) {
    const cell = this.L.cells.find((c) => c && c.kind === 'store' && c.owner === p);
    if (cell?.score) {
      const sc = { ...cell.score, rot: this.upright ? 0 : cell.score.rot }, tx = sc.x + sc.w / 2, ty = sc.y + sc.h / 2;
      const fs = Math.min(sc.h * 0.62, sc.w * 0.5);
      const amb = /^[69]+$/.test(String(n)) || String(n).includes('6') || String(n).includes('9');
      const el = this.cellEls[this.L.cells.indexOf(cell)].querySelector('.score-text');
      el.innerHTML = `<g transform="rotate(${sc.rot} ${tx} ${ty})"><text x="${tx}" y="${ty + fs * 0.35}" text-anchor="middle" font-size="${fs}" class="score-num">${n}</text>
        ${sc.rot === 180 && amb ? `<rect x="${tx - fs * 0.32}" y="${ty + fs * 0.5}" width="${fs * 0.64}" height="${fs * 0.07}" rx="2" fill="#3b2a17"/>` : ''}</g>`;
    }
    const badge = this.svg.querySelector(`.badge[data-p="${p}"] .badge-score`);
    if (badge) badge.textContent = n;
  }

  // 지금 차례 표시
  setActive(p, { selectable = [] } = {}) {
    this.active = p;
    this.L.cells.forEach((cell, i) => {
      if (!cell) return;
      const el = this.cellEls[i];
      if (cell.kind === 'store') {
        const fr = cell.frame;
        el.querySelector('.store-glow').innerHTML = cell.owner === p
          ? `<rect x="${fr.x - 8}" y="${fr.y - 8}" width="${fr.w + 16}" height="${fr.h + 16}" rx="${fr.rx + 8}" fill="none" stroke="${PLAYER_COLORS[p]}" stroke-width="6" filter="url(#glow)" class="pulse"/>`
          : '';
      }
      const on = selectable.includes(i);
      el.classList.toggle('selectable', on);
      // 고를 수 있는 칸: 지금 차례인 사람 색 테두리
      const sel = el.querySelector('.sel');
      if (sel) {
        if (on && cell.kind === 'pit') {
          const sh = cell.shape, pad = 5;
          const big = sh.kind === 'circle'
            ? { kind: 'circle', cx: sh.cx, cy: sh.cy, r: sh.r + pad }
            : { kind: 'rect', x: sh.x - pad, y: sh.y - pad, w: sh.w + 2 * pad, h: sh.h + 2 * pad, rx: sh.rx + pad };
          sel.innerHTML = shapeSVG(big, `fill="none" stroke="${PLAYER_COLORS[p]}" stroke-width="5" filter="url(#glow)" class="pulse"`);
        } else sel.innerHTML = '';
      }
    });
    this.svg.querySelectorAll('.badge').forEach((b) => {
      const on = +b.dataset.p === p;
      b.style.opacity = on ? 1 : 0.55;
      b.querySelector('.badge-glow').setAttribute('opacity', on ? 1 : 0);
    });
    this.renderCenter(p);
  }

  renderCenter(p) {
    const g = this.svg.querySelector('.center-layer');
    const { center } = this.L;
    if (this.players !== 4 || p < 0) { g.innerHTML = ''; return; }
    const col = PLAYER_COLORS[p];
    if (this.L.kind === '4p-tablet') {
      const rot = this.L.seatAngle[p];
      g.innerHTML = `<g transform="rotate(${rot} ${center.x} ${center.y})" class="turn-arrow">
        <path d="M${center.x} ${center.y - 70} L${center.x} ${center.y + 70} M${center.x - 55} ${center.y + 18} L${center.x} ${center.y + 74} L${center.x + 55} ${center.y + 18}" stroke="${col}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    } else {
      const nm = esc(this.names[p]);
      g.innerHTML = `<g class="turn-pill"><rect x="${center.x - 130}" y="${center.y - 40}" width="260" height="80" rx="40" fill="${col}"/>
        <text x="${center.x}" y="${center.y + 14}" text-anchor="middle" font-size="38" class="pill-text">▶ ${nm}</text></g>`;
    }
  }

  setArrows(on) { this.svg.querySelector('.arrows').style.display = on ? '' : 'none'; }

  addLog(line) {
    if (!this.L.log) return;
    this.logLines.unshift(line);
    this.logLines = this.logLines.slice(0, Math.max(1, Math.floor((this.L.log.h - 100) / 62)));
    this.renderLog();
  }

  renderLog() {
    const { x, y, w, h } = this.L.log;
    const rows = this.logLines.slice(0, Math.max(1, Math.floor((h - 100) / 62))).map((l, k) => `<g transform="translate(${x + 24} ${y + 110 + k * 62})">
      <circle cx="10" cy="-11" r="10" fill="${PLAYER_COLORS[l.p]}"/><text x="32" y="0" font-size="28" class="log-text">${esc(l.text)}</text></g>`).join('');
    this.svg.querySelector('.log').innerHTML = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#fbf8f3" stroke="#e2d8c8" stroke-width="2"/>
      <text x="${x + w / 2}" y="${y + 58}" text-anchor="middle" font-size="32" class="log-title">최근 기록</text>${rows}`;
  }

  center(i) { return shapeCenter(this.L.cells[i].shape); }

  // 화면상의 칸 위치(확인창 배치용)
  cellRect(i) { return this.cellEls[i].querySelector('.hit').getBoundingClientRect(); }

  // 공 하나 날리기 (포물선)
  flyBall(n, from, to, ms, r = 26) {
    return new Promise((resolve) => {
      const g = document.createElementNS(NS, 'g');
      this.fly.appendChild(g);
      const [x0, y0] = from, [x1, y1] = to;
      const dx = x1 - x0, dy = y1 - y0, dist = Math.hypot(dx, dy) || 1;
      const lift = Math.min(90, dist * 0.35);
      const cx = (x0 + x1) / 2 - (dy / dist) * lift * 0.3, cy = (y0 + y1) / 2 - lift;
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / ms);
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const x = (1 - e) ** 2 * x0 + 2 * (1 - e) * e * cx + e * e * x1;
        const y = (1 - e) ** 2 * y0 + 2 * (1 - e) * e * cy + e * e * y1;
        const sc = 1 + 0.25 * Math.sin(Math.PI * e);
        g.innerHTML = ballSVG(n, x, y, r * sc);
        if (t < 1) requestAnimationFrame(step); else { g.remove(); resolve(); }
      };
      requestAnimationFrame(step);
    });
  }

  ballRadius() { return this.players === 4 ? 24 : 26; }

  // 칸 강조(색 테두리) — 잠시
  flash(i, color, ms = 600, cls = 'flash') {
    const cell = this.L.cells[i];
    const sh = cell.kind === 'store' ? cell.frame : cell.shape;
    const mark = this.cellEls[i].querySelector('.mark');
    const pad = 6;
    const big = sh.kind === 'circle'
      ? { kind: 'circle', cx: sh.cx, cy: sh.cy, r: sh.r + pad }
      : { kind: 'rect', x: sh.x - pad, y: sh.y - pad, w: sh.w + 2 * pad, h: sh.h + 2 * pad, rx: sh.rx + pad };
    mark.innerHTML = shapeSVG(big, `fill="none" stroke="${color}" stroke-width="6" filter="url(#glow)" class="${cls}"`);
    if (ms) setTimeout(() => { mark.innerHTML = ''; }, ms);
  }

  clearMark(i) { this.cellEls[i].querySelector('.mark').innerHTML = ''; }

  shake(i) {
    const el = this.cellEls[i];
    el.classList.remove('shake'); void el.getBoundingClientRect(); el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 450);
  }

  // 점수 튀어 오름 "+N"
  pop(i, text, color) {
    const [x, y] = this.center(i);
    const rot = this.textRot(this.L.cells[i].owner);
    const t = document.createElementNS(NS, 'g');
    t.setAttribute('class', 'pop');
    t.innerHTML = `<g transform="rotate(${rot} ${x} ${y})"><text x="${x}" y="${y}" text-anchor="middle" font-size="64" fill="${color}" stroke="#fff" stroke-width="6" paint-order="stroke" class="pop-text">${esc(text)}</text></g>`;
    this.fx.appendChild(t);
    setTimeout(() => t.remove(), 1100);
  }

  // 플레이어 p가 읽는 방향 각도
  textRot(p) {
    if (this.upright) return 0;
    if (this.L.kind === '4p-tablet') return this.L.seatAngle[p];
    if (this.L.kind === '2p-land' || this.L.kind === '2p-port') return p === 1 ? 180 : 0;
    return 0;
  }

  // 캡처 빛줄기: 상대 칸(from) → 내 칸(to)
  async captureBeam(from, to, color, balls, ms) {
    const [x0, y0] = this.center(from), [x1, y1] = this.center(to);
    const beam = document.createElementNS(NS, 'g');
    beam.innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${color}" stroke-width="34" stroke-linecap="round" opacity=".75" filter="url(#beamGlow)"/>
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#fff" stroke-width="6" stroke-linecap="round" class="beam-core"/>`;
    beam.setAttribute('class', 'beam');
    this.fx.appendChild(beam);
    this.flash(to, color, 0, 'flash-on');
    this.flash(from, '#e5484d', 0, 'flash-on');
    this.shake(from);
    await sleep(ms * 1.2);
    return () => { beam.remove(); this.clearMark(from); this.clearMark(to); };
  }
}
