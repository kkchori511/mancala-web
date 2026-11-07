// 온라인 2인 대전: Firebase 실시간 데이터베이스를 수 전달용으로만 쓴다.
// 방 구조 rooms/{코드}:
//   createdAt, seats/{0,1}: {uid, name}, online/{0,1}: true(접속 중)
//   state: {status:'waiting'|'playing'|'over', round, start, turn, result:{winner, reason}|null}
//   moves/{round}/{i}: {s: 자리, p: 칸(0~5)}  ← "누가 몇 번 칸"만 기록, 각 기기가 같은 엔진으로 재생
// Firebase 코드는 온라인을 처음 쓸 때만 불러온다(오프라인 게임에는 영향 없음).
import { firebaseConfig } from './firebase-config.js';

const CDN = 'https://www.gstatic.com/firebasejs/13.2.0/';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 0·O, 1·I 제외
const STALE_MS = 24 * 60 * 60 * 1000; // 하루 지난 방은 새 방이 덮어씀

let fb = null; // { auth, db, uid, m: {db 함수들} }

export async function connect() {
  if (fb) return fb.uid;
  const [appM, authM, dbM] = await Promise.all([
    import(CDN + 'firebase-app.js'), import(CDN + 'firebase-auth.js'), import(CDN + 'firebase-database.js'),
  ]);
  const app = appM.initializeApp(firebaseConfig);
  const auth = authM.getAuth(app);
  const cred = await authM.signInAnonymously(auth);
  fb = { auth, db: dbM.getDatabase(app), uid: cred.user.uid, m: dbM };
  return fb.uid;
}

const r = (path) => fb.m.ref(fb.db, path);
const roomPath = (code) => `rooms/${code}`;
const cleanName = (s) => String(s || '').trim().slice(0, 6) || '손님';
export const normCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);

function randomCode() {
  const a = new Uint32Array(4);
  crypto.getRandomValues(a);
  return [...a].map((v) => CODE_CHARS[v % CODE_CHARS.length]).join('');
}

// 방 만들기 → { code, seat: 0 }
export async function createRoom(name) {
  await connect();
  const { runTransaction, serverTimestamp } = fb.m;
  for (let tries = 0; tries < 6; tries++) {
    const code = randomCode();
    const start = Math.random() < 0.5 ? 0 : 1;
    const res = await runTransaction(r(roomPath(code)), (cur) => {
      if (cur && cur.createdAt && cur.createdAt > Date.now() - STALE_MS) return undefined; // 사용 중 → 다른 코드
      return {
        createdAt: serverTimestamp(),
        seats: { 0: { uid: fb.uid, name: cleanName(name) } },
        state: { status: 'waiting', round: 0, start, turn: start },
      };
    }, { applyLocally: false });
    if (res.committed) return { code, seat: 0 };
  }
  throw new Error('방을 만들지 못했어요. 다시 시도해 주세요.');
}

// 코드로 참가(또는 내가 있던 방에 다시 들어가기) → { code, seat }
export async function joinRoom(rawCode, name, { rejoinOnly = false } = {}) {
  await connect();
  const code = normCode(rawCode);
  if (code.length !== 4) throw new Error('방 코드 4자리를 입력해 주세요.');
  const snap = await fb.m.get(r(roomPath(code)));
  const room = snap.val();
  if (!room || !room.seats) throw new Error('그 코드의 방이 없어요.');
  for (const s of [0, 1]) if (room.seats[s]?.uid === fb.uid) return { code, seat: s };
  if (rejoinOnly) throw new Error('이전 방에 다시 들어갈 수 없어요.');
  if (room.seats[1] || room.state?.status !== 'waiting') throw new Error('이미 두 명이 들어간 방이에요.');
  await fb.m.update(r(roomPath(code)), {
    'seats/1': { uid: fb.uid, name: cleanName(name) },
    'state/status': 'playing',
  });
  return { code, seat: 1 };
}

// 방 전체를 지켜봄. 바뀔 때마다 onRoom(room|null). 끝내는 함수를 돌려줌
export function watchRoom(code, onRoom) {
  return fb.m.onValue(r(roomPath(code)), (snap) => onRoom(snap.val()), () => onRoom(null));
}

// 접속 표시: 연결이 끊기면 서버가 자동으로 지움. 다시 연결되면 다시 표시
export function goOnline(code, seat, onConn) {
  const { onDisconnect, set } = fb.m;
  const me = r(`${roomPath(code)}/online/${seat}`);
  const stop = fb.m.onValue(r('.info/connected'), (snap) => {
    const c = snap.val() === true;
    onConn?.(c);
    if (!c) return;
    onDisconnect(me).remove().then(() => set(me, true)).catch(() => {});
  });
  return () => { stop(); onDisconnect(me).cancel().catch(() => {}); fb.m.remove(me).catch(() => {}); };
}

// 수 보내기. nextTurn: 둔 뒤 차례, over: 게임 끝 여부
export function sendMove(code, round, index, seat, pit, nextTurn, over) {
  const u = { [`moves/${round}/${index}`]: { s: seat, p: pit }, 'state/turn': nextTurn };
  if (over) u['state/status'] = 'over';
  return fb.m.update(r(roomPath(code)), u);
}

// 기권·연결 끊김 결과
export function writeResult(code, winner, reason) {
  return fb.m.update(r(`${roomPath(code)}/state`), { status: 'over', result: { winner, reason } });
}

// 다시 하기: 끝난 판에서 한 번만 다음 판으로 (선공 교대)
export function rematch(code, round) {
  return fb.m.runTransaction(r(`${roomPath(code)}/state`), (s) => {
    if (!s || s.round !== round || s.status !== 'over') return undefined;
    const start = 1 - s.start;
    return { status: 'playing', round: round + 1, start, turn: start, result: null };
  });
}

export function deleteRoom(code) {
  return fb.m.remove(r(roomPath(code)));
}

export const myUid = () => fb?.uid;
