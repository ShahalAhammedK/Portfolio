# Portfolio Video Series: Draft Plan v1

Every fact here comes from `data/profile.json`, the same source the website uses.
The videos use the site's look: obsidian black, lime accents, and the lime particle wave from the hero section.

---

## 1. The idea

**One story across a short series:** *"Understand people. Build what's next."*
Shahal sits where consumer research, data, and generative AI meet. Each video opens one door of that story.

| # | Video | Length | Where it goes |
|---|-------|--------|---------------|
| 1 | **Hero trailer**: who Shahal is | 30–40 s | Site hero background, LinkedIn header post |
| 2 | **AI Studio**: selfie to launch key visual | 20 s | AI Studio case study, Reel/Short |
| 3 | **Social Media Analytics + Sentiment**: every campaign, measured | 20 s | Analytics case study, Reel/Short |
| 4 | **Consumer Research**: listening before every launch | 15 s | Research section, Reel/Short |
| 5 | **Credentials**: MSc AI, 13+ certificates | 10–15 s | Credentials section, LinkedIn |

Formats: **16:9** for the website and **9:16** for Reels, Shorts and TikTok, cut from the same shots.

---

## 2. How we build it

AI video models can't render exact text and numbers reliably, so the work is split:

- **Higgsfield** makes the moving scenes: particle waves, a city at night, phones, data flowing, abstract dashboards.
  Proposed model: **Seedance 2.5** (5–10 s shots, takes reference images so the shots match the site's look).
- **Editing** adds every word and number: headlines, stats, names.
  That way "19 studies" or "A+" always appears exactly right.
- **Voiceover** (optional): an AI voice from Higgsfield, or your own voice recorded on your phone.
- **Music**: one cinematic electronic track used across the series so the videos feel connected.

---

## 3. Script: Video 1, Hero trailer (about 35 s)

| Time | Visual (Higgsfield scene) | On-screen text | Voiceover |
|------|---------------------------|----------------|-----------|
| 0–4 s | Black screen. A lime particle wave rises and ripples, like the site hero. | — | *"Every launch starts with a question."* |
| 4–9 s | Camera glides over the Dubai skyline at night; lime light trails trace the roads. | **Understand people.** | *"What do people really want?"* |
| 9–14 s | Fast montage: interview room, survey answers floating in English, Arabic and Hindi, a phone turning slowly. | UAE · KSA · 19 studies | *"I run consumer research across the UAE and Saudi Arabia…"* |
| 14–20 s | The answers turn into glowing data streams that build a dashboard. | 18 campaign dashboards | *"…turn it into data…"* |
| 20–26 s | The data streams form a smartphone screen. A selfie becomes a campaign poster. | **Build what's next.** · AI Studio · 2 launches | *"…and build the AI that scales it."* |
| 26–31 s | Stats count up over the particle wave. | 3 yrs · 2 launches · 10 country sites · 13+ certificates | — |
| 31–35 s | Wave settles; the logo resolves. | **Shahal Ahammed K** · Consumer Insights & Data Analyst · Generative AI Builder | *"I'm Shahal. Let's connect."* |

## 4. Short scripts: Videos 2–5

**Video 2: AI Studio (20 s)**
1. A visitor takes a selfie on a phone in a modern mall. *"Upload a selfie."*
2. The selfie dissolves into lime particles. *"Generative AI does the rest."*
3. A finished key-visual poster lands, with the person holding the phone. *"Your own launch poster."*
4. End card: **AI Studio** · Shipped for 2 smartphone launches · OpenAI Image API · Cloudflare · Python.
   *(The real sample outputs from the site are shown at the end as stills.)*

**Video 3: Social Media Analytics + Sentiment (20 s)**
1. Many phone screens float in space, each playing a short creator video. *"Dozens of creators. Three platforms."*
2. Comments float off the screens and sort into green, grey and red streams. *"Every comment read."*
3. The streams collapse into a clean dashboard. *"Every campaign, measured."*
4. End card: **18 campaign dashboards** · TikTok · Instagram · YouTube · UAE vs KSA.

**Video 4: Consumer Research (15 s)**
1. Quiet interview setting, soft light, a notebook and a phone on the table. *"Listening before every launch."*
2. A map of the UAE lights up: Dubai, Abu Dhabi, Sharjah, Fujairah.
3. End card: **19 studies · 12 models · 3 series** · IDIs · AIPL decks · EN / AR / HI surveys.

**Video 5: Credentials (12 s)**
1. A graduation cap made of lime particles. **MSc Computer Science (AI), A+**, University of Kerala.
2. Certificates stack up like cards. **IBM Data Science Professional Certificate · 13+ verified certificates**.
3. A medal glints. **Rajya Puraskar state honour**.

---

## 5. Points to agree before we generate

1. **Budget.** The Higgsfield account currently has **10 credits** (Ultra plan). That is likely enough for only one or two short
   test shots, not the full series. Option: generate a few test scenes for Video 1 first, then top up credits once you like the look.
2. **Your face.** Should the videos use your portrait (AI animation of your photo), or stay faceless (abstract, data, city)?
   I recommend faceless for most shots, plus a real photo on the end card.
3. **Brand and confidential data.** AI scenes won't show vivo logos or real campaign numbers; phones stay unbranded. Only the
   fictional sample reports already on the site appear as stills. Please check whether vivo is fine with the AI Studio outputs appearing in a video.
4. **Voiceover.** AI voice, your own voice, or music with text only?
5. **Order.** Start with Video 1 (hero trailer), then 2 and 3?

## 6. Next steps once approved
1. Generate 2–3 test shots for Video 1 (particle wave, Dubai skyline, data-to-phone) and review them together.
2. Lock the style, then generate the rest of the shots.
3. Edit: text, stats, music, voice → 16:9 and 9:16 exports.
4. Optionally add Video 1 to the site hero as a muted, looping background (it will respect `prefers-reduced-motion`).
