// Guards the /admin dashboard pages. The login page itself must stay reachable.
// API-level auth (for PUT/POST endpoints) is handled separately inside each function.

import { getSessionUser } from './_lib/auth.js';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Only the dashboard itself is gated — login.html, admin.css, and any other
  // static assets under /admin/ must stay publicly loadable or the login page
  // can't even render its own stylesheet.
  const isProtectedPage = path === '/admin' || path === '/admin/' || path === '/admin/index.html';

  if (isProtectedPage) {
    const user = await getSessionUser(request, env);
    if (!user) {
      return Response.redirect(`${url.origin}/admin/login.html`, 302);
    }
  }

  return next();
}
