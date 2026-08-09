// Guards the /admin dashboard pages. The login page itself must stay reachable.
// API-level auth (for PUT/POST endpoints) is handled separately inside each function.

import { getSessionUser } from './_lib/auth.js';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const isAdminPage =
    (path === '/admin' || path === '/admin/' || path.startsWith('/admin/')) &&
    path !== '/admin/login.html' &&
    path !== '/admin/login';

  if (isAdminPage) {
    const user = await getSessionUser(request, env);
    if (!user) {
      return Response.redirect(`${url.origin}/admin/login.html`, 302);
    }
  }

  return next();
}
