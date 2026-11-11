# Higgsfield prompt pack: portfolio videos

Paste everything inside the box below into a **new Claude chat on claude.ai** (with the Higgsfield connector
turned on). Free trial generations work there, not in Claude Code.
When it's done, copy the results table it gives you back into the Claude Code session.

````text
Use the Higgsfield connector to make 15 short silent videos for my portfolio website, using my unlimited trial.

SETTINGS FOR EVERY VIDEO
- model: seedance_2_0, mode: std, resolution: 720p, duration: 5, generate_audio: false, use_unlim: true
- For videos with a SOURCE image: first import the image URL with media_import_url, then pass the returned
  media_id with role "start_image" (videos 1-12) or "image_references" (video 15). Use aspect_ratio "auto".
- For videos without a source image (13, 14): aspect_ratio "16:9".
- Shared style rule (add to every prompt): "Subtle, slow, premium motion. Keep the composition, colours, faces,
  logos and any text exactly as in the image. Smooth motion that could loop. No new text, no new logos."
- Submit them with generate_video_batch (two batches: 1-12, then 13-15), wait for all to finish, then show them.

At the end, give me a table with: number, name, job_id, result video URL.

VIDEOS
1. hero-portrait
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/portrait.jpg
   PROMPT: The man stays almost still, natural, only a slow breath and one slow blink; a soft lime rim light slowly sweeps across his shoulder from the right. Very slow camera push-in. Background stays pure dark.

2. card-ai-studio
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/card-ai-studio.jpg
   PROMPT: Two campaign posters side by side. The glow behind each poster gently pulses (green on the left, orange halo on the right), light glints travel across both phones, the people smile naturally and move very slightly. Slow push-in.

3. sentiment
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/sentiment-analysis.jpg
   PROMPT: The man stays still apart from a breath and a blink. The four glowing chat bubbles float gently up and down, light pulses travel along the glowing lines into the ring chart, the ring slowly rotates with a soft lime glow. Slow push-in.

4. card-insights
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/card-insights.jpg
   PROMPT: The man stays still, thinking, hand on chin, a slow blink. The holographic panels come alive: bar chart bars grow, the line chart draws itself, people icons light up lime one by one, glowing data lines flow between panels. City bokeh drifts softly in the background.

5. ai-studio-showcase
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/ai-studio-showcase.jpg
   PROMPT: Two campaign posters. The orange sun halo behind each person slowly glows and shimmers, light glints sweep across the phones, the people move very slightly and naturally. Slow push-in.

6. campaign-analysis
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/campaign-analysis.jpg
   PROMPT: The man works at the desk, small natural hand movement on the mouse. On the curved monitor the small charts animate: lines rise, bars grow, icons pulse lime. City lights twinkle through the window. Slow push-in.

7. ai-toolkit
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/ai-toolkit.jpg
   PROMPT: The man types gently. Glowing text lines scroll upward on the left transcript panel, lime light streams flow from it into the report cards on the right, the charts on the right grow. Slow push-in.

8. ipl-analytics
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/ipl-analytics.jpg
   PROMPT: Night cricket stadium. Floodlights flicker softly, the scatter-plot dots on the left screen drift into clusters, the decision tree on the middle screen lights up node by node, bars grow on the right screen. Slow aerial drift forward.

9. imdb-eda
   SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/imdb-eda.jpg
   PROMPT: The film reel slowly turns, the film strip unrolls slightly, the three holographic charts animate (line rises, bars grow, histogram bars rise one by one) with a soft lime glow. Slow push-in.

10. localisation
    SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/localisation.jpg
    PROMPT: Laptop and three phones on a desk at dusk. The screens softly glow and their content gently scrolls, city lights twinkle in the window, warm lantern light flickers. Slow sideways camera drift.

11. honours
    SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/honours.jpg
    PROMPT: The glass medal and trophy slowly turn a little, light glints sweep across the glass, the lime and violet light ribbons flow around them. Dark background. Slow push-in.

12. research-desk
    SOURCE: https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/li-research.jpg
    PROMPT: The man sits thinking, hand on chin, a slow blink. The transparent charts on the window glass animate softly, the city skyline outside shimmers in daylight haze. Slow push-in.

13. particle-wave (no source image)
    PROMPT: Pure black void. Thousands of tiny glowing lime-green particles rise and form a smooth flowing wave that ripples slowly across the frame, like a sound wave made of light. Soft bloom, shallow depth of field, slow push-in. Minimal premium tech look. No text.

14. dubai-skyline (no source image)
    PROMPT: Cinematic aerial drone shot gliding slowly over the Dubai skyline at night, tall glass skyscrapers, dark moody near-black tones; the roads are traced by flowing lime-green light trails. Smooth forward camera, high contrast, premium tech commercial look. No text, no signs.

15. x300-ultra
    REFERENCE (role image_references): https://raw.githubusercontent.com/ShahalAhammedK/Portfolio/claude/elegant-cerf-35px6y/static/img/phones/x300-ultra.png
    PROMPT: Dark obsidian black space. Streams of glowing lime-green data particles flow in from all sides and form the exact smartphone from the reference image, seen from the back: pale sage-green body, large round black four-lens camera module, lighter band at the bottom. Keep the phone's design, colour and markings exactly as in the reference. The phone floats and slowly rotates while a soft lime rim light sweeps across it. Slow orbiting camera.
````

## Where each video goes on the site

| # | Video | Place on the page |
|---|-------|-------------------|
| 1 | hero-portrait | Hero portrait (replaces the still photo) |
| 2 | card-ai-studio | Home card: AI Studio |
| 3 | sentiment | Home card: Social Media Analytics, and the Sentiment project card |
| 4 | card-insights | Home card: Consumer Insights, and the IDI project card |
| 5 | ai-studio-showcase | Project card: AI Studio (featured) |
| 6 | campaign-analysis | Project card: Social Media Analytics (featured) |
| 7 | ai-toolkit | Project card: AI Reporting Toolkit |
| 8 | ipl-analytics | Project card: IPL Auction Prediction |
| 9 | imdb-eda | Project card: IMDB EDA |
| 10 | localisation | Project card: vivo ME Website & Localisation |
| 11 | honours | Credentials: honours artwork |
| 12 | research-desk | LinkedIn highlight / Consumer Insights viewer |
| 13 | particle-wave | Hero background (replaces the 480p draft) |
| 14 | dubai-skyline | Research header backdrop (replaces the 480p draft) |
| 15 | x300-ultra | CTA card (replaces the 480p draft) |
