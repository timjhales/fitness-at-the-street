import { verifyPassword, makeSessionForUser, sessionCookieHeader } from '../_lib/auth.js';
import { getJSON, appendAuditLog } from '../_lib/data.js';
import { jsonResponse } from '../_lib/http.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const { username, password } = body || {};
  if (!username || !password) {
    return jsonResponse({ error: 'Username and password are required' }, 400);
  }

  const users = await getJSON(env, 'admin-users.json', []);
  const user = users.find((u) => u.username.toLowerCase() === String(username).toLowerCase());
  if (!user) {
    return jsonResponse({ error: 'Invalid username or password' }, 401);
  }

  const ok = await verifyPassword(password, user.salt, user.passwordHash);
  if (!ok) {
    return jsonResponse({ error: 'Invalid username or password' }, 401);
  }

  const token = await makeSessionForUser(user, env);
  await appendAuditLog(env, { username: user.username, action: 'login', summary: 'Logged in' });

  return jsonResponse(
    { ok: true, displayName: user.displayName },
    200,
    { 'Set-Cookie': sessionCookieHeader(token) }
  );
}
