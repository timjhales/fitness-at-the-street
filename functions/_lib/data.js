// Small helpers around the FATS_KV namespace.

export async function getJSON(env, key, fallback) {
  const value = await env.FATS_KV.get(key, 'json');
  return value === null ? fallback : value;
}

export async function putJSON(env, key, value) {
  await env.FATS_KV.put(key, JSON.stringify(value));
}

export async function appendAuditLog(env, entry) {
  const log = await getJSON(env, 'audit-log.json', []);
  log.unshift({ ...entry, timestamp: Date.now() });
  await putJSON(env, 'audit-log.json', log.slice(0, 200));
}
