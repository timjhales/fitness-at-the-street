// One-time bootstrap endpoint. Seeds the initial admin accounts.
// Gated by SETUP_TOKEN (a Pages secret only Tim has) and refuses to run
// if any admin user already exists, so it can't be used to add/reset
// accounts later by anyone who finds the URL.

import { generateSalt, hashPassword } from '../../_lib/auth.js';
import { getJSON, putJSON } from '../../_lib/data.js';
import { jsonResponse } from '../../_lib/http.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const { setupToken, users } = body || {};

  if (!env.SETUP_TOKEN || setupToken !== env.SETUP_TOKEN) {
    return jsonResponse({ error: 'Invalid setup token' }, 403);
  }

  if (!Array.isArray(users) || users.length === 0) {
    return jsonResponse({ error: 'Provide a "users" array of { username, password, displayName }' }, 400);
  }

  const existing = await getJSON(env, 'admin-users.json', []);
  if (existing.length > 0) {
    return jsonResponse({ error: 'Admin users already exist. Setup has already run.' }, 409);
  }

  const created = [];
  for (const u of users) {
    if (!u.username || !u.password || !u.displayName) {
      return jsonResponse({ error: 'Each user needs username, password, and displayName' }, 400);
    }
    const salt = generateSalt();
    const passwordHash = await hashPassword(u.password, salt);
    created.push({ username: u.username, displayName: u.displayName, salt, passwordHash });
  }

  await putJSON(env, 'admin-users.json', created);

  return jsonResponse({ ok: true, createdUsernames: created.map((u) => u.username) });
}
