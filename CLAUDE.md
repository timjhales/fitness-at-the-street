# Working style

- Routine site edits (HTML/CSS/JS changes, image swaps, content updates) get committed and pushed automatically, same as always — no need to ask each time. Pushing to a branch auto-deploys via Cloudflare Pages' git integration, so this is just the normal workflow, not a "deployment" action requiring sign-off.
- Tim handles Cloudflare dashboard actions himself (uploading via the admin panel, clicking through settings, form-filling on external sites) — Claude doesn't drive a browser or take computer actions there unless explicitly asked.
- When something needs visual testing, Tim will share a screenshot.
- Keep responses concise — no lengthy summaries after completing a task.
- Still check with Tim before anything genuinely risky or unusual (force-push, branch resets, billing/account changes, etc.) — the automatic-push default is for normal day-to-day edits, not everything.

# Background image approach

All pages use two `position: fixed` divs for the background instead of `background-attachment: fixed` on `body`:

```html
<div id="bg-image"></div>
<div id="bg-overlay"></div>
```

```css
#bg-image { position: fixed; inset: 0; z-index: -2; background: url('FATSOUTSIDE.jpeg') center -20% / cover no-repeat; }
#bg-overlay { position: fixed; inset: 0; z-index: -1; background: rgba(23,23,21,0.72); pointer-events: none; }
```

Parallax JS targets `#bg-image`, not `document.body`:
```js
document.getElementById('bg-image').style.backgroundPositionY = `calc(-20% - ${window.scrollY * 0.3}px)`;
```

This fixes iOS/Android where `background-attachment: fixed` causes the image to be oversized and not scroll correctly.
