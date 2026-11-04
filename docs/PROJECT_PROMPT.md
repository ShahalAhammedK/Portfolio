# Portfolio — master prompt

Copy everything below the line into ChatGPT or Claude to recreate this portfolio from scratch, or to keep
working on it in a new chat. If you are continuing the existing code, attach (or point the AI at) the repo
`github.com/ShahalAhammedK/Portfolio` and say "continue from the existing code; keep everything below".

---

You are building (or continuing) the personal portfolio website of **Shahal Ahammed K**, Consumer Insights &
Data Analyst | Generative AI Builder at **vivo Middle East**, Dubai, UAE. Follow this spec exactly.

## 1. Tech and structure
- **Flask** app (`app.py`) serving one page from `templates/index.html` (Jinja2), with `static/css/style.css`,
  `static/js/main.js` (vanilla JS, no frameworks) and images in `static/img/`.
- **All content lives in `data/profile.json`.** The template only renders that data; editing the JSON must be
  enough to update the site.
- `POST /api/contact` validates name/email/message and appends to `data/messages.jsonl` (git-ignored).
- `python app.py build` exports a static copy to `dist/` for GitHub Pages/Netlify (contact form falls back to
  `mailto:` there). Use relative asset paths (`static/...`) so it works under a sub-path.
- A Jinja global `has_static(path)` checks if an image exists, so phone photos dropped into
  `static/img/phones/<slug>.png|webp|jpg` appear automatically; otherwise a CSS phone graphic is shown.

## 2. Design system (obsidian + lime)
- Colours: background `#0a0d10`, surface `#11151b`, card `#141920`, lime accent `#d2f852` (hover `#dffb78`),
  text `#f8fafc`, muted `#94a3b8`, soft `#cbd5e1`, borders `rgba(255,255,255,0.09)`.
- Fonts (Google Fonts): **Plus Jakarta Sans** 700–800 for headings, **Inter** for body,
  **JetBrains Mono** for eyebrows/labels (uppercase, wide letter-spacing).
- Cards: dark gradient, 18px radius, thin border; highlighted cards get a lime border + soft lime glow.
- Buttons: lime pill (primary, with a shine sweep on hover), ghost pill, lime outline pill, round 40px arrow
  buttons. Headline style: white line + lime line (e.g. "Explore what **I've built.**").
- Motion: fade/slide-up reveals on scroll with stagger, count-up numbers, scroll progress bar, smooth hover
  lifts and image zooms. Respect `prefers-reduced-motion`. Fully responsive; no horizontal scroll on phones.

## 3. Page, top to bottom
1. **Sticky nav**: wordmark `shahal.` (lime dot), links Work · Research · About · Experience · Credentials ·
   LinkedIn (active link lime with underline), "Let's connect" lime button, section counter `01 / 05`,
   burger menu on mobile.
2. **Hero**: eyebrow "CONSUMER INSIGHTS & DATA ANALYST | GENERATIVE AI BUILDER", "Dubai UAE · vivo Middle
   East"; rotating 2-line headline slides with progress dashes + arrows, auto-advance ~6.5s, words animate in:
   - "Understand people. / Build what's next."
   - "Run the research. / Ship the AI engine."
   - "Decode creators. / Guide GCC launches."
   - "MSc in AI. / 13+ verified credentials."
   Buttons "Explore my work" and "Download CV". Right side: Shahal's portrait (`portrait.jpg`) fading into the
   dark, with an animated canvas **lime particle wave** flowing across his shoulders (never over the face),
   reacting to the mouse. Below: 3 image cards (AI Studio, Social Media Analytics, Consumer Insights) that open
   an image viewer; "Scroll to explore" mouse cue; LinkedIn + GitHub icons.
3. **About**: "Research to **decisions.**", short intro, 4 stat cards (3 yrs · 2 launches shipped with AI
   Studio · 10 country websites managed · 13+ certificates), and a scrolling skills ticker.
4. **Work / Project gallery**: "Explore what **I've built.**", filter pills (All · AI & Engineering · Research ·
   Analytics), sticky "Find a project" sidebar with the same categories as radio items and a profile card
   (`avatar.jpg`, Dubai UAE, vivo Middle East, MSc CS (AI)). Two equal main-work cards side by side, both with
   lime border, badge and "Open case study": **AI Studio** and **Social Media Analytics** (`main: true`). Below
   them a full-width featured card for **Campaign Sentiment Analysis** (opens its case study). "Explore other
   work" horizontal carousel with pager dots: IPL Auction Prediction (GitHub link), UAE & KSA Smartphone IDIs &
   AIPL Decks, AI Reporting Toolkit & Interview Simulator, IMDB Movie Industry EDA (GitHub link), vivo ME
   Website & Launch Localisation (official sites for 10 ME countries).
5. **AI Studio case study**: challenge, approach, tags, four clickable pipeline layers with typewriter detail
   (Mask Pipeline, Gender Prompting, Cloudflare Edge, Frame Mode) and an inline image viewer showing the real
   sample outputs (vivo V80 male/female, V80 Lite male/female) on a blurred backdrop.
   Followed by two more case studies in the same layout (data: `case_studies` list in profile.json), each with a
   "Sample reports coming soon" chip until real reports are added:
   - **Social Media Analytics**: every launch campaign tracked in one place, creators compared across
     TikTok/Instagram/YouTube. Layers: Campaign Overview, Creator Performance, Audience Insights, Comparisons.
     Never describe how it is built (no tech stack, APIs, data sources or page mechanics). Button
     "See the campaign dashboards" jumps to section 7.
   - **Campaign Sentiment Analysis** (second web app): comments classified positive/neutral/negative, coded into
     themes (camera, design, battery, price), tested across platforms and UAE vs KSA. Layers: Comment Capture,
     Sentiment, Theme Coding, Testing. Viewer images are labelled "Illustrative".
6. **Consumer Research** ("Listening before **every launch.**"): counters (19 studies · 12 models · 3 series),
   filter (All · X series · V series · iQOO), one card per phone listing its studies: X300 Ultra, X300 Pro,
   X300, V70 (+ upgraded), V70 FE (+ upgraded), X200 Pro, X200 FE (customer survey, table survey, consumer
   research), V60, V60 Lite, V50, iQOO 13 (completed with three interviews), iQOO 12 (KSA); plus a cross-series
   row: X300 Series Consumer Research, Series Wise Conclusion, IR and OR Customer Survey.
7. **Campaign dashboards** ("Every campaign, **measured.**"): 18 social-media campaign dashboards with filter
   (All · Launch campaigns · Comparisons · KOL dashboards · Competitor) and counters. Comparison cards show their
   phones side by side: V80 Lite; X300 FE vs X200 FE; X300 Ultra; X300 Ultra & FE; V70 FE; V70 vs V60 vs V50;
   V70; X300 Series vs X200 Pro; vivo X300 Series; vivo Y31 5G (KSA); V60 Lite KOL; V60 vs V50; V50; V60
   (KSA & GCC); X200 Pro; X200 FE; Honor 400 (competitor benchmark); KOL dashboard for iQOO Neo 10 & Z10.
8. **Experience & education**: vivo Middle East, Business Commercial Specialist — Branding & Consumer Research
   (Apr 2025 – Present, JLT Dubai) with 4 highlight blocks (IDIs & AIPL decks; influencer campaign & sentiment
   analytics; GenAI apps & AI reporting toolkit; trilingual EN/AR/HI surveys & websites). Below the blocks, a
   strip "Official vivo websites I manage · 10 countries" (link vivo.com/ae/en) with country chips: UAE, Saudi
   Arabia, Kuwait, Qatar, Bahrain, Oman, Iraq, Jordan, Lebanon, Yemen (one chip per country, no EN/AR split). Wincept
   Technologies, Data Analyst & Data Science Intern (Nov 2023 – Dec 2024, Kerala) with document links. MSc
   Computer Science (AI), University of Kerala (8.54/10, A+); BSc Computer Science, University of Calicut.
9. **Credentials & LinkedIn** ("Learning, ideas & milestones."): tabs Credentials (featured 4) · All
   certificates (11) · Honours (5) · LinkedIn highlights. Cards with artwork on the right; clicking one fills a
   sticky detail drawer (title, issuer, type, date, "Listed on LinkedIn", verify button, copy-LinkedIn-link bar,
   related learning). "From LinkedIn" row: Consumer research, vivo launch milestones, IPL auction prediction.
10. **CTA** card "Have a question about **your customers?**" and footer.
11. **Modals**: full-screen image viewer (thumbnails, arrows, keyboard, swipe, captions) and "Let's connect"
    (email, phone, LinkedIn, GitHub, contact form).

## 4. Contact
Email shahalshalukolloli@gmail.com · Phone +971 54 515 3730 · LinkedIn linkedin.com/in/shahal-ahammed/ ·
GitHub github.com/ShahalAhammedK. CV: `static/cv.pdf` when provided.

## 5. Images (all in `static/img/`)
- Shahal: `portrait.jpg` (hero), `avatar.jpg` (B&W with lime circle), `card-insights.jpg`, `li-research.jpg`,
  `campaign-analysis.jpg`, `sentiment-analysis.jpg`, `ai-toolkit.jpg`, `li-ipl.jpg`.
- AI Studio outputs: `aistudio-v80-m/f.jpg`, `aistudio-v80lite-m/f.jpg`, pairs `ai-studio-showcase.jpg`,
  `card-ai-studio.jpg`.
- Scenes/art: `ipl-analytics.jpg`, `imdb-eda.jpg`, `localisation.jpg`, `honours.jpg`, `sentiment-dashboard.jpg`
  (labelled "Illustrative data"), certificate art `cred-*.jpg`.
- Phones: `static/img/phones/<slug>.png`, same angle/size/lighting for all, transparent background. Slugs:
  x300-ultra, x300-pro, x300, x300-fe, x200-pro, x200-fe, v80-lite, v70, v70-fe, v60, v60-lite, v50, y31-5g,
  iqoo-13, iqoo-12, iqoo-neo-10, iqoo-z10, honor-400.

## 6. Rules
- Never invent achievements, numbers or results. Anything illustrative is labelled as such
  ("Illustrative data", "Sample outputs generated by AI Studio").
- Keep the GPA out of the hero headline (it appears only in education/sidebar/honours).
- No AI-generated people other than Shahal and the AI Studio sample outputs.
- Keep everything data-driven, responsive and accessible (focus states, alt text, aria labels).
