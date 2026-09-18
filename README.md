# 🎮 DuelZone

**DuelZone** is a free, ad-free browser game hub — 25+ casual and competitive games, zero downloads, zero logins. Built mobile-first with vanilla HTML/CSS/JS, so it runs anywhere a browser does.

🔗 **Live site:** [duelzone.online](https://duelzone.online) *(update or remove if not applicable)*

---

## ✨ Features

- **25+ games** — Chess, Checkers, Ludo, Tetris, Battleship, Connect Four, Blackjack, Sudoku, Minesweeper, Snake, Pool, Air Hockey, Tanks, Bomberman, and more
- **Local multiplayer** — pass-and-play on the same device for head-to-head games
- **Bot opponents** — play solo against AI in supported games
- **No accounts, no downloads, no ads** — just open and play
- **Installable PWA** — add to your home screen via `manifest.json` + service worker
- **Dark/light theme** — persisted via `localStorage`
- **XP & profile system** — track matches played, wins, and level up

## 🗂️ Project Structure

```
duelzone/
├── index.html            # Hub — search, filters, nav, trending games
├── chess.html / chess.js # Full chess engine with bot AI
├── ludo.html / ludo.js   # Ludo implementation
├── tetris.html / tetris.js
├── checkers.html         # Checkers (self-contained)
├── *.html                # One HTML file per game (battleship, blackjack, etc.)
├── dz-core.js            # Player profile, XP system, global audio
├── dz-games.js           # Game registry (metadata for every game)
├── dz-game-shell.js      # Shared game-page helpers (result overlay, back button)
├── dz-hub.js             # Hub rendering, search, filters, bottom nav
├── dz-router.js          # Query-param routing (?game=chess)
├── dz-theme.js           # Dark/light theme persistence
├── dzshare.js            # Canvas-based share cards
├── duelzone.css          # Design system (colors, spacing, components)
├── manifest.json         # PWA manifest
├── service-worker.js     # Offline caching
└── DEPLOY.md             # Deployment notes
```

## 🚀 Run Locally

No build step required — it's static HTML/CSS/JS.

```bash
git clone https://github.com/YOUR_USERNAME/duelzone.git
cd duelzone
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000).

Alternatively, just open `index.html` directly in a browser (some features like the service worker require serving over HTTP).

## 🌐 Deploying

This repo is ready to host on any static file host. Two common options:

### Option A — GitHub Pages (included workflow)

This repo includes `.github/workflows/deploy.yml`, which auto-deploys to GitHub Pages on every push to `main`.

1. Push this repo to GitHub
2. Go to **Settings → Pages** → set **Source** to "GitHub Actions"
3. Push to `main` — the workflow will build and deploy automatically
4. Your site will be live at `https://YOUR_USERNAME.github.io/REPO_NAME/`

For a custom domain, edit or remove the `CNAME` file in the repo root and configure DNS accordingly (see GitHub's [custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).

### Option B — Cloudflare Pages

See [DEPLOY.md](./DEPLOY.md) for step-by-step Cloudflare Pages instructions.

## 🎯 Adding a New Game

1. Create `mygame.html` following the pattern of an existing game (setup screen + play screen + result overlay)
2. Register it in `dz-games.js`:
   ```js
   { id: 'mygame', title: 'My Game', icon: '🎮', desc: 'Short tagline',
     category: 'arcade', modes: 'pvp', status: 'live', href: 'mygame.html', plays: '0' }
   ```
3. Add the HTML filename to `service-worker.js`'s cache list if you want offline support
4. Link the shared scripts (`dz-games.js`, `dz-theme.js`, `dz-core.js`, `dz-game-shell.js`, `dzshare.js`) and reuse `duelzone.css` classes for a consistent look

## 🛠️ Tech Stack

- Vanilla JavaScript (ES5/ES6, no framework, no build tools)
- CSS custom properties for theming
- Service Worker for offline caching
- Web Audio API for procedural sound effects (no audio files)
- Canvas API for share-card generation

## 📄 License

MIT — see [LICENSE](./LICENSE).

## 🤝 Contributing

Issues and pull requests are welcome. Since there's no build step, most changes can be tested by simply opening the relevant HTML file in a browser.

---

Built by VGWA · Contact: hello@duelzone.online
