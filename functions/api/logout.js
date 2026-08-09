import { clearSessionCookieHeader, getSessionUser } from '../_lib/auth.js';
import { appendAuditLog } from '../_lib/data.js';
import { jsonResponse } from '../_lib/http.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const user = await getSessionUser(request, env);
  if (user) {
    await appendAuditLog(env, { username: user.username, action: 'logout', summary: 'Logged out' });
  }
  return jsonResponse({ ok: true }, 200, { 'Set-Cookie': clearSessionCookieHeader() });
}
