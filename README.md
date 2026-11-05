# Shahal Ahammed K — Portfolio

An animated, single-page portfolio built with **Flask** and vanilla HTML/CSS/JS (no frontend frameworks).

Design: obsidian + lime, built from the UI mockups (Homepage, Project Gallery, Image Viewer, Credentials & LinkedIn).

**Features:** rotating hero headlines with an animated lime particle wave, filterable project gallery with a
"Find a project" sidebar, case studies (AI Studio, Social Media Analytics, Campaign Sentiment Analysis) with an interactive pipeline-layer explorer, full-screen image
viewer (keyboard + swipe), experience and education cards, credentials/honours tabs with a detail drawer,
LinkedIn highlights, a "Let's connect" modal with a working contact form, mobile menu, and
`prefers-reduced-motion` support.

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000. For auto-reload while editing, run with `FLASK_DEBUG=1` (never on a public server: the debugger can run code).

Security: the server and the static build (`dist/_headers`) send a Content-Security-Policy and other security
headers; the contact form only accepts same-site JSON, max 64 KB, 5 messages per visitor per 10 minutes.

## Update your content

Everything shown on the site comes from **`data/profile.json`**: hero slides, stats, projects, image viewers,
case study, experience, education, credentials, honours, LinkedIn posts and contact details.
Edit that file and refresh the page. You don't need to touch the HTML.

- **Your photo:** the hero uses a sample portrait. Replace `static/img/portrait.jpg` (wide, ~1500×900) and
  `static/img/avatar.jpg`, then set `"portrait_label": ""` to hide the "Sample portrait" tag.
- **Projects:** add to `"projects"`. Use `"cat"` = `ai`, `research` or `analytics`; add `"url"` to link out,
  or `"viewer"` to open an image gallery defined under `"viewers"`. Set `"featured": true` for the top two cards.
- **Credentials / honours:** add to `"credentials"` with `"tab": "cert"` or `"honour"`; `"featured": true` shows it
  on the first tab.
- **CV download:** put your PDF in `static/` (e.g. `static/cv.pdf`) and set `"cv_url": "static/cv.pdf"`.
- **Consumer research phones:** studies are listed under `"research"` in `profile.json`. To show a real product
  photo, save it as `static/img/phones/<slug>.png` (transparent PNG works best; `.webp` or `.jpg` also work),
  e.g. `static/img/phones/x300-ultra.png`. Until then a styled phone graphic is shown.
- **Images** live in `static/img/`.

Messages sent through the contact form are saved to `data/messages.jsonl` (git-ignored).

## Deploy

- **Flask host** (Render, Railway, PythonAnywhere): deploy as a normal Flask app (`app:app`).
- **Static host** (GitHub Pages, Netlify): run `python app.py build` and publish the `dist/` folder.
- **Cloudflare Workers** (repo connected under Workers & Pages, uses `wrangler.jsonc`):
  Settings → Build → Build command `pip install -r requirements.txt && python app.py build`,
  Deploy command `npx wrangler deploy`. Then Settings → Domains & Routes → enable `workers.dev`.
- **Cloudflare Pages** (connected to this GitHub repo, redeploys on every push):
  Workers & Pages → Create → Pages → Connect to Git → pick `ShahalAhammedK/Portfolio`, then set
  - Production branch: `claude/elegant-cerf-35px6y` (the repo's default branch; merge changes into it to go live)
  - Framework preset: None
  - Build command: `pip install -r requirements.txt && python app.py build`
  - Build output directory: `dist`
  - Environment variable: `PYTHON_VERSION` = `3.12`

  The contact form falls back to `mailto:` on the static site.
  On static hosting the contact form opens the visitor's email app instead.
