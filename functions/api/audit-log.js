import { getSessionUser } from '../_lib/auth.js';
import { getJSON } from '../_lib/data.js';
import { jsonResponse } from '../_lib/http.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const user = await getSessionUser(request, env);
  if (!user) return jsonResponse({ error: 'Not logged in' }, 401);

  const log = await getJSON(env, 'audit-log.json', []);
  return jsonResponse(log);
}
