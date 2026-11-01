/* Portfolio interactions: vanilla JS, no dependencies. */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Preloader ---------- */
  const loaderBar = $(".loader__bar");
  const loaderCount = $("#loaderCount");
  let progress = 0;
  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 14 + 4, 100);
    loaderCount.textContent = Math.floor(progress);
    loaderBar.style.setProperty("--p", progress + "%");
    if (progress >= 100) clearInterval(tick);
  }, 70);

  const finishLoading = () => {
    const wait = () => {
      if (progress < 100) return requestAnimationFrame(wait);
      setTimeout(() => {
        document.body.classList.remove("is-loading");
        document.body.classList.add("is-ready");
        startTyping();
        $$(".reveal").forEach((el) => io.observe(el));
      }, 250);
    };
    wait();
  };
  if (document.readyState === "complete") finishLoading();
  else window.addEventListener("load", finishLoading);
  setTimeout(() => { progress = 100; }, 3500); // safety net if fonts are slow

  /* ---------- Background: animated data constellation ---------- */
  const canvas = $("#bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, DPR, points = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    const count = Math.round(Math.min(110, (innerWidth * innerHeight) / 14000));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25 * DPR,
      vy: (Math.random() - 0.5) * 0.25 * DPR,
      r: (Math.random() * 1.4 + 0.6) * DPR,
      hue: Math.random() < 0.5 ? "167,139,250" : "34,211,238",
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const linkDist = 130 * DPR;
    const mouseDist = 180 * DPR;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      const dxm = p.x - mouse.x, dym = p.y - mouse.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < mouseDist) {
        const f = (1 - dm / mouseDist) * 0.6;
        p.x += (dxm / dm) * f; p.y += (dym / dm) * f;
        ctx.strokeStyle = `rgba(${p.hue},${(1 - dm / mouseDist) * 0.5})`;
        ctx.lineWidth = DPR * 0.8;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }

      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < linkDist) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / linkDist) * 0.12})`;
          ctx.lineWidth = DPR * 0.6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${p.hue},0.85)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  resize();
  draw();
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(resize, 150); });
  addEventListener("mousemove", (e) => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; });
  addEventListener("mouseout", () => { mouse.x = mouse.y = -9999; });

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    const dot = $(".cursor-dot"), ring = $(".cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      document.body.classList.add("cursor-on");
    });
    document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-on"));
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    $$("a, button, input, textarea, .tilt").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ---------- Typewriter ---------- */
  function startTyping() {
    const el = $("#typed");
    const roles = JSON.parse(el.dataset.roles || "[]");
    if (!roles.length) return;
    if (reduceMotion) { el.textContent = roles[0]; return; }
    let r = 0, c = 0, deleting = false;
    (function step() {
      const word = roles[r];
      el.textContent = word.slice(0, c);
      let delay = deleting ? 40 : 85;
      if (!deleting && c === word.length) { deleting = true; delay = 1800; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
      c += deleting ? -1 : 1;
      setTimeout(step, delay);
    })();
  }

  /* ---------- Scroll reveal, counters, skill % ---------- */
  const animateNumber = (el, target, suffix = "") => {
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now(), dur = 1600;
    (function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-in");
      $$(".counter", el).forEach((c) => animateNumber(c, +c.dataset.target));
      $$(".skill__pct", el).forEach((c) => animateNumber(c, +c.dataset.target, "%"));
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  // Stagger siblings that don't set --i explicitly
  $$(".about__text, .stats, .hero__inner").forEach((group) => {
    $$(":scope > .reveal", group).forEach((el, i) => {
      if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", i);
    });
  });

  /* ---------- Scroll-driven bits: progress, nav, timeline ---------- */
  const nav = $("#nav");
  const bar = $("#progressBar");
  const timeline = $(".timeline");
  const fill = $("#timelineFill");
  let lastY = scrollY;

  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle("is-scrolled", y > 40);
    if (!nav.classList.contains("is-open")) nav.classList.toggle("is-hidden", y > lastY && y > 400);
    lastY = y;

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.65 - r.top) / r.height, 0), 1);
      fill.style.transform = `scaleY(${p})`;
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active section link
  const links = $$("[data-link]");
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => sectionIO.observe(s));

  // Mobile menu
  const burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
    nav.classList.remove("is-hidden");
  });
  links.forEach((l) => l.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }));

  /* ---------- 3D tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        if (card.classList.contains("reveal") && !card.classList.contains("is-in")) return;
        card.style.transition = "transform 0.15s ease-out, border-color .4s, background .4s";
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateZ(0)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "";
        card.style.transform = "";
      });
    });

    /* ---------- Magnetic buttons ---------- */
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    /* ---------- Hero parallax ---------- */
    const visual = $(".hero__visual");
    if (visual) {
      addEventListener("mousemove", (e) => {
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        $$(".float-card", visual).forEach((c, i) => {
          c.style.translate = `${x * (14 + i * 10)}px ${y * (14 + i * 10)}px`;
        });
        $(".orb", visual).style.translate = `${x * -8}px ${y * -8}px`;
      });
    }
  }

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  const isStatic = document.body.dataset.static === "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    status.className = "form__status";

    if (!data.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) || !data.message.trim()) {
      status.textContent = "Please fill in your name, a valid email and a message.";
      status.classList.add("err");
      return;
    }

    const mailto = () => {
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n${data.name} · ${data.email}`);
      location.href = `mailto:${form.dataset.email}?subject=${subject}&body=${body}`;
    };

    if (isStatic) { mailto(); return; }

    const btn = $("button[type=submit] span", form);
    const label = btn.textContent;
    btn.textContent = "Sending…";
    try {
      const res = await fetch("api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      status.textContent = "Thanks! Your message has been sent. I'll get back to you soon.";
      status.classList.add("ok");
      form.reset();
    } catch (err) {
      status.textContent = "Couldn't send right now. Opening your email app instead…";
      status.classList.add("err");
      setTimeout(mailto, 900);
    } finally {
      btn.textContent = label;
    }
  });
})();
