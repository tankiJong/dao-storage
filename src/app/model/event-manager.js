var mEventPool = new WeakMap();

const idxs = {};
const randomStr = (length) => {
  const len = length || 32;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
const getTag = () => {
  const tag = randomStr;
  if(idxs[tag]){
    return tag;
  } else {
    return getTag();
  }
}

export class EventManager {
  constructor () {
    var pool = {};
    mEventPool.set(this, pool);
  }

  emit (tag) {
    var pool = mEventPool.get(this);
    if (!pool) return;
    pool[tag]();
  }

  hook (callback) {
    var pool = mEventPool.get(this);
    if (!pool) return;
    const tag = getTag();
    pool[tag] = callback;
    return tag;
  }

  emitAll(){
    var pool = mEventPool.get(this);
    if (!pool) return;
    for(const k in pool){
      pool[k]();
    }
  }
}
