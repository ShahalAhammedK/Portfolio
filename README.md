# Shahal Ahammed K — Portfolio

An animated, single-page portfolio built with **Flask** and vanilla HTML/CSS/JS (no frontend frameworks).

**Features:** preloader, interactive "data constellation" background, aurora gradients, custom cursor,
letter-by-letter hero reveal, typewriter roles, orbiting skill rings, magnetic buttons, 3D tilt + spotlight cards,
animated counters and skill bars, scroll-drawn experience timeline, skill marquee, a working contact form,
mobile menu, and `prefers-reduced-motion` support.

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000

## Update your content

Everything shown on the site comes from **`data/profile.json`**: name, roles, about text, stats, skills,
experience, education, contact links. Edit that file and refresh the page. You don't need to touch the HTML.

- **Projects:** add items to `"projects"` and a Projects section appears automatically:
  ```json
  { "title": "Sales Dashboard", "text": "What it did and the impact.", "tags": ["Power BI", "SQL"], "link": "https://..." }
  ```
- **CV download:** put your PDF in `static/` (e.g. `static/cv.pdf`) and set `"cv_url": "static/cv.pdf"`.
- **Contact:** replace the placeholder `email` and `linkedin` values.

Messages sent through the contact form are saved to `data/messages.jsonl` (git-ignored).

## Deploy

- **Flask host** (Render, Railway, PythonAnywhere): deploy as a normal Flask app (`app:app`).
- **Static host** (GitHub Pages, Netlify): run `python app.py build` and publish the `dist/` folder.
  On static hosting the contact form opens the visitor's email app instead.
