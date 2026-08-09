import { getSessionUser } from '../_lib/auth.js';
import { getJSON, putJSON, appendAuditLog } from '../_lib/data.js';
import { DEFAULT_CLASS_IMAGES } from '../_lib/defaults.js';
import { jsonResponse } from '../_lib/http.js';

const KEY = 'class-images.json';

export async function onRequestGet(context) {
  const data = await getJSON(context.env, KEY, DEFAULT_CLASS_IMAGES);
  return jsonResponse(data, 200, { 'Cache-Control': 'public, max-age=60' });
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const user = await getSessionUser(request, env);
  if (!user) return jsonResponse({ error: 'Not logged in' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }
  if (!Array.isArray(body)) {
    return jsonResponse({ error: 'Expected an array of class images' }, 400);
  }

  await putJSON(env, KEY, body);
  await appendAuditLog(env, {
    username: user.username,
    action: 'update-class-images',
    summary: `Updated class images (${body.length} slots)`,
  });

  return jsonResponse({ ok: true });
}
