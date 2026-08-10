import { getSessionUser, generateSalt, hashPassword } from '../../_lib/auth.js';
import { getJSON, putJSON, appendAuditLog } from '../../_lib/data.js';
import { jsonResponse } from '../../_lib/http.js';

const KEY = 'admin-users.json';

export async function onRequestGet(context) {
  const { request, env } = context;
  const requester = await getSessionUser(request, env);
  if (!requester) return jsonResponse({ error: 'Not logged in' }, 401);

  const users = await getJSON(env, KEY, []);
  return jsonResponse(users.map((u) => ({ username: u.username, displayName: u.displayName })));
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const requester = await getSessionUser(request, env);
  if (!requester) return jsonResponse({ error: 'Not logged in' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const { username, password, displayName } = body || {};
  if (!username || !password || !displayName) {
    return jsonResponse({ error: 'username, password, and displayName are required' }, 400);
  }
  if (password.length < 8) {
    return jsonResponse({ error: 'Password must be at least 8 characters' }, 400);
  }

  const users = await getJSON(env, KEY, []);
  if (users.some((u) => u.username.toLowerCase() === String(username).toLowerCase())) {
    return jsonResponse({ error: 'That username is already taken' }, 409);
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  users.push({ username, displayName, salt, passwordHash });
  await putJSON(env, KEY, users);

  await appendAuditLog(env, {
    username: requester.username,
    action: 'add-admin',
    summary: `Added new admin user "${username}" (${displayName})`,
  });

  return jsonResponse({ ok: true });
}
