# Shahal Ahammed K — Portfolio

An animated, single-page portfolio built with **Flask** and vanilla HTML/CSS/JS (no frontend frameworks).

Design: obsidian + lime, built from the UI mockups (Homepage, Project Gallery, Image Viewer, Credentials & LinkedIn).

**Features:** rotating hero headlines with an animated lime particle wave, filterable project gallery with a
"Find a project" sidebar, AI Studio case study with an interactive pipeline-layer explorer, full-screen image
viewer (keyboard + swipe), experience and education cards, credentials/honours tabs with a detail drawer,
LinkedIn highlights, a "Let's connect" modal with a working contact form, mobile menu, and
`prefers-reduced-motion` support.

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000

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
- **Images** live in `static/img/`.

Messages sent through the contact form are saved to `data/messages.jsonl` (git-ignored).

## Deploy

- **Flask host** (Render, Railway, PythonAnywhere): deploy as a normal Flask app (`app:app`).
- **Static host** (GitHub Pages, Netlify): run `python app.py build` and publish the `dist/` folder.
  On static hosting the contact form opens the visitor's email app instead.
