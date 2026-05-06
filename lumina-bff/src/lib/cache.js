const store = new Map();

export function set(key, value, ttlMs) {
  const expireAt = Date.now() + ttlMs;
  store.set(key, { value, expireAt });
}

export function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expireAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function del(key) {
  store.delete(key);
}

export function size() {
  return store.size;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (now > v.expireAt) store.delete(k);
  }
}, 60_000).unref();
