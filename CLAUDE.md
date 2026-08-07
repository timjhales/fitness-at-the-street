# Working style

- Tim handles all deployment, uploading, clicking, and form-filling himself
- Claude writes code and files only — no automated browser or computer actions unless explicitly asked
- When something needs testing, Tim will share a screenshot
- Keep responses concise — no lengthy summaries after completing a task
- Always check with Tim before starting any automated sequence, and confirm understanding back before beginning

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
