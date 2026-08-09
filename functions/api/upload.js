import { getSessionUser } from '../_lib/auth.js';
import { appendAuditLog } from '../_lib/data.js';
import { jsonResponse } from '../_lib/http.js';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4']);
const MAX_BYTES = 25 * 1024 * 1024; // 25MB

export async function onRequestPost(context) {
  const { request, env } = context;
  const user = await getSessionUser(request, env);
  if (!user) return jsonResponse({ error: 'Not logged in' }, 401);

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return jsonResponse({ error: 'No file provided' }, 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonResponse({ error: `Unsupported file type: ${file.type}` }, 400);
  }
  if (file.size > MAX_BYTES) {
    return jsonResponse({ error: 'File too large (25MB max)' }, 400);
  }

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const key = `${crypto.randomUUID()}.${ext}`;

  await env.FATS_MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  await appendAuditLog(env, {
    username: user.username,
    action: 'upload-media',
    summary: `Uploaded ${file.name} (${Math.round(file.size / 1024)}KB)`,
  });

  return jsonResponse({ ok: true, src: `/api/media/${key}` });
}
