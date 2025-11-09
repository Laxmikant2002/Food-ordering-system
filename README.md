Restaurant Website Demo

## 🚀 Live Demo
**[View Live Website](https://your-deployment-url.netlify.app)** ← Replace with your actual deployment link

> Deploy this project easily on [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), [GitHub Pages](https://pages.github.com/), or any static hosting service.

---

What this repo contains
- `index.html` — simple UI that displays a menu and simulates an order flow.
- `style.css` — minimal styling for the demo.
- `script.js` — UI logic and the async functions:
  - `getMenu()` — attempts to fetch `menu.json` and renders the menu. Falls back to an embedded array if fetch fails.
  - `TakeOrder()` — returns a Promise and resolves after 2500 ms. Picks three items (prefers burgers if available) and returns an order object { orderId, items, total }.
  - `orderPrep()` — returns a Promise and resolves after 1500 ms with { order_status: true, paid: false }.
  - `payOrder()` — returns a Promise and resolves after 1000 ms with { order_status: true, paid: true }.
  - `thankyouFnc()` — shows a thank you message in the status area.
- `menu.json` — the menu data (JSON).
- `test_node.js` — a small node script to run the promise chain headlessly (see below).

Promises contract & timings
- TakeOrder(): resolves in 2500 ms with an order object { orderId: number, items: Array, total: number }.
- orderPrep(order): resolves in 1500 ms with a status object { order_status: true, paid: false }.
- payOrder(status): resolves in 1000 ms with a status object { order_status: true, paid: true }.
- thankyouFnc(): no return value — shows a message on the UI.
