// 효과음 (Web Audio 합성). 공 충돌음은 나중에 무료(CC0) 파일로 바꿀 수 있게 이름별로 분리.
let ctx = null;
let master = null;
let enabled = true;
let volume = 0.7;

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setSound(on, vol) {
  enabled = on;
  volume = vol;
  if (master) master.gain.value = vol;
}

// 첫 터치 때 오디오 잠금 해제 (iOS)
export function unlockAudio() { try { ac(); } catch { /* 오디오 미지원 */ } }

function noiseBuffer(c, dur) {
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// 딱딱한 공 부딪힘: 짧은 잡음 + 높은 사인 감쇠
function click(t, { freq = 2400, gain = 0.5, dur = 0.07, q = 6 } = {}) {
  const c = ac();
  const n = c.createBufferSource(); n.buffer = noiseBuffer(c, dur);
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  n.connect(bp).connect(g).connect(master); n.start(t); n.stop(t + dur);
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(freq * 0.9, t);
  const g2 = c.createGain();
  g2.gain.setValueAtTime(gain * 0.5, t); g2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.8);
  o.connect(g2).connect(master); o.start(t); o.stop(t + dur);
}

function tone(t, freq, dur, { type = 'sine', gain = 0.3 } = {}) {
  const c = ac();
  const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
}

function thump(t) {
  const c = ac();
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
  const g = c.createGain();
  g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o.connect(g).connect(master); o.start(t); o.stop(t + 0.32);
}

const SOUNDS = {
  // 칸에 공이 떨어짐: 짧은 "톡"
  drop: (t) => click(t, { freq: 1500, gain: 0.25, dur: 0.05, q: 3 }),
  // 저장고 득점: 공끼리 "딱"
  score: (t) => { click(t, { freq: 2800, gain: 0.55, dur: 0.08 }); click(t + 0.045, { freq: 3300, gain: 0.3, dur: 0.06 }); },
  // 캡처: "쾅" + "촤르륵"
  capture: (t) => { thump(t); for (let i = 0; i < 9; i++) click(t + 0.08 + i * 0.045 + Math.random() * 0.02, { freq: 2200 + Math.random() * 1600, gain: 0.35 - i * 0.025, dur: 0.06 }); },
  // 캡처한 공이 저장고로
  captureStore: (t) => { thump(t); click(t + 0.02, { freq: 3000, gain: 0.6, dur: 0.1 }); },
  // 추가 턴: 올라가는 차임
  extra: (t) => [659, 880, 1175].forEach((f, i) => tone(t + i * 0.08, f, 0.35, { gain: 0.22 })),
  // 차례 넘김
  turn: (t) => tone(t, 523, 0.18, { type: 'triangle', gain: 0.12 }),
  // 선택 확인
  select: (t) => tone(t, 784, 0.1, { type: 'triangle', gain: 0.15 }),
  // 막힘(빈 칸·상대 칸)
  deny: (t) => tone(t, 180, 0.12, { type: 'square', gain: 0.06 }),
  // 종료 팡파르
  fanfare: (t) => {
    [[523, 0], [659, 0.14], [784, 0.28], [1047, 0.46]].forEach(([f, d]) => tone(t + d, f, 0.5, { type: 'triangle', gain: 0.25 }));
    [523, 659, 784, 1047].forEach((f) => tone(t + 0.7, f, 1.2, { type: 'sine', gain: 0.12 }));
  },
};

export function play(name) {
  if (!enabled || !SOUNDS[name]) return;
  try { const c = ac(); SOUNDS[name](c.currentTime + 0.005); } catch { /* 무시 */ }
}
