/* shahal. portfolio — interactions (vanilla JS, no dependencies) */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DATA = JSON.parse($("#siteData").textContent);
  const asset = (p) => "static/" + p;
  const pad = (n) => String(n).padStart(2, "0");

  /* ============ Toast ============ */
  const toastEl = $("#toast");
  let toastT;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  };

  /* ============ Reveal + counters ============ */
  const countUp = (el) => {
    const target = +el.dataset.target;
    if (reduce) { el.textContent = target; return; }
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min((now - t0) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      $$(".counter", e.target).forEach(countUp);
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  $$(".reveal").forEach((el) => revealIO.observe(el));

  /* ============ Nav: progress, active link, counter, burger ============ */
  const nav = $("#nav");
  const bar = $("#progressBar");
  const counter = $("#sectionCounter");
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }, { passive: true });

  const links = $$("[data-link]");
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      const linkId = id.startsWith("case-") ? "work" : id === "home" ? "" : id;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + linkId));
      if (counter && e.target.dataset.index) counter.textContent = `${pad(e.target.dataset.index)} / 05`;
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  $$("main section[id], #linkedin").forEach((s) => sectionIO.observe(s));

  const burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  links.forEach((l) => l.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }));

  /* ============ Hero: rotating headline slides ============ */
  const hero = $("#home");
  const slidesEl = $("#heroSlides");
  const slides = JSON.parse(slidesEl.dataset.slides);
  const line1 = $("#heroLine1"), line2 = $("#heroLine2"), summary = $("#heroSummary");
  const dashes = $$(".dash", hero);
  const DURATION = 6500;
  let heroIdx = 0, heroTimer;

  const splitWords = (el, text) => {
    el.innerHTML = text.split(" ").map((w, i) =>
      `<span class="w"><span style="--d:${i}">${w.replace(/([.’'])/g, '<i class="punct">$1</i>')}</span></span>`).join(" ");
  };
  const paintSlide = (i) => {
    const s = slides[i];
    splitWords(line1, s.line1);
    splitWords(line2, s.line2);
    $$(".w > span", line2).forEach((sp, k) => sp.style.setProperty("--d", k + s.line1.split(" ").length));
    summary.textContent = s.summary;
    dashes.forEach((d, k) => {
      d.classList.toggle("is-active", k === i);
      d.style.setProperty("--dur", DURATION + "ms");
    });
    // restart dash animation
    const active = dashes[i] && $("i", dashes[i]);
    if (active) { active.style.display = "none"; void active.offsetWidth; active.style.display = ""; }
  };
  const goSlide = (i) => {
    i = (i + slides.length) % slides.length;
    if (i === heroIdx) return;
    heroIdx = i;
    if (reduce) { paintSlide(i); return; }
    slidesEl.classList.remove("is-in");
    slidesEl.classList.add("is-out");
    setTimeout(() => {
      slidesEl.classList.remove("is-out");
      paintSlide(i);
      requestAnimationFrame(() => requestAnimationFrame(() => slidesEl.classList.add("is-in")));
    }, 480);
    schedule();
  };
  const schedule = () => {
    clearTimeout(heroTimer);
    if (!reduce) heroTimer = setTimeout(() => goSlide(heroIdx + 1), DURATION);
  };
  paintSlide(0);
  requestAnimationFrame(() => requestAnimationFrame(() => slidesEl.classList.add("is-in")));
  schedule();
  $("#heroPrev").addEventListener("click", () => goSlide(heroIdx - 1));
  $("#heroNext").addEventListener("click", () => goSlide(heroIdx + 1));
  dashes.forEach((d) => d.addEventListener("click", () => goSlide(+d.dataset.slide)));
  const heroContent = $(".hero__content");
  heroContent.addEventListener("mouseenter", () => { hero.classList.add("is-paused"); clearTimeout(heroTimer); });
  heroContent.addEventListener("mouseleave", () => { hero.classList.remove("is-paused"); schedule(); });

  /* ============ Hero: lime particle wave ============ */
  const canvas = $("#waveCanvas");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, DPR = 1, t = 0, running = true;
  const mouse = { x: -1, y: -1 };
  const STRANDS = 7, DOTS = 90;

  const sizeCanvas = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = canvas.width = r.width * DPR;
    H = canvas.height = r.height * DPR;
  };
  const drawWave = () => {
    ctx.clearRect(0, 0, W, H);
    for (let s = 0; s < STRANDS; s++) {
      const phase = s * 0.55;
      const amp = H * (0.035 + s * 0.008);
      for (let i = 0; i < DOTS; i++) {
        const p = i / (DOTS - 1);
        const x = W * (0.22 + p * 0.78);
        let y = H * (1.06 - p * 0.46 + s * 0.016)
          + Math.sin(p * 6.2 + t * 0.9 + phase) * amp
          + Math.sin(p * 2.1 - t * 0.5 + s) * amp * 0.6;
        if (mouse.x >= 0) {
          const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 140 * DPR) y += (dy / (d || 1)) * (140 * DPR - d) * 0.25;
        }
        const tw = 0.5 + 0.5 * Math.sin(i * 12.9898 + s * 78.233 + t * 2.4);
        const alpha = Math.min(1, p * 1.6) * (0.25 + tw * 0.75) * (1 - s * 0.08);
        const r = (0.8 + tw * 1.6) * DPR * (i % 7 === 0 ? 1.8 : 1);
        ctx.beginPath();
        ctx.fillStyle = `rgba(210,248,82,${alpha.toFixed(3)})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    t += 0.012;
    if (running && !reduce) requestAnimationFrame(drawWave);
  };
  sizeCanvas();
  drawWave();
  addEventListener("resize", sizeCanvas);
  hero.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * DPR;
    mouse.y = (e.clientY - r.top) * DPR;
    const portrait = $("#heroPortrait");
    const mx = (e.clientX / innerWidth - 0.5), my = (e.clientY / innerHeight - 0.5);
    portrait.style.translate = `${mx * -14}px ${my * -10}px`;
  });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -1; });
  new IntersectionObserver(([e]) => {
    const was = running;
    running = e.isIntersecting;
    if (running && !was) drawWave();
  }).observe(hero);

  /* ============ Project filter ============ */
  const pills = $$(".work .pills .pill");
  const finderItems = $$(".finder__item");
  const featured = $$(".project-feature");
  const rows = $$(".project-row");
  const othersLabel = $("#othersLabel");
  const track = $("#othersTrack");
  const dotsWrap = $("#othersDots");
  const catNames = { all: "every category", ai: "AI & Engineering", research: "Research", analytics: "Analytics" };

  const buildDots = () => {
    const pages = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05));
    dotsWrap.innerHTML = Array.from({ length: pages }, (_, i) =>
      `<button type="button" aria-label="Page ${i + 1}" data-page="${i}"></button>`).join("");
    $$("button", dotsWrap).forEach((b) => b.addEventListener("click", () =>
      track.scrollTo({ left: +b.dataset.page * track.clientWidth, behavior: "smooth" })));
    syncDots();
  };
  const syncDots = () => {
    const page = Math.round(track.scrollLeft / track.clientWidth);
    $$("button", dotsWrap).forEach((b, i) => b.classList.toggle("is-active", i === page));
  };
  track.addEventListener("scroll", () => requestAnimationFrame(syncDots), { passive: true });
  $("#othersPrev").addEventListener("click", () => track.scrollBy({ left: -track.clientWidth, behavior: "smooth" }));
  $("#othersNext").addEventListener("click", () => track.scrollBy({ left: track.clientWidth, behavior: "smooth" }));
  addEventListener("resize", buildDots);

  const applyFilter = (cat) => {
    pills.forEach((p) => p.classList.toggle("is-active", p.dataset.filter === cat));
    finderItems.forEach((f) => f.classList.toggle("is-active", f.dataset.filter === cat));
    featured.forEach((f, i) => {
      const match = cat === "all" || f.dataset.cat === cat;
      f.classList.toggle("is-filtered-out", !match);
      f.classList.toggle("is-match", match && cat !== "all");
      f.classList.toggle("is-highlight", cat === "all" && f.dataset.main === "true");
    });
    let shown = 0;
    rows.forEach((r) => {
      const match = cat === "all" || r.dataset.cat === cat;
      r.hidden = !match;
      if (match) shown++;
    });
    othersLabel.textContent = `${shown} project${shown === 1 ? "" : "s"} · ${catNames[cat]}`;
    track.scrollTo({ left: 0 });
    buildDots();
  };
  [...pills, ...finderItems].forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));
  applyFilter("all");

  $$("[data-case-study]").forEach((b) => b.addEventListener("click", () => {
    const target = $("#case-" + (b.dataset.caseStudy || "aistudio"));
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }));

  /* ============ Consumer research: filter by series ============ */
  const rPills = $$("#researchPills .pill");
  const phoneCards = $$("#phones .phone-card");
  rPills.forEach((b) => b.addEventListener("click", () => {
    const s = b.dataset.series;
    rPills.forEach((x) => x.classList.toggle("is-active", x === b));
    let i = 0;
    phoneCards.forEach((c) => {
      const show = s === "all" || c.dataset.series === s;
      c.hidden = !show;
      if (show) {
        c.style.setProperty("--i", i++ % 4);
        c.classList.remove("is-in");
        requestAnimationFrame(() => c.classList.add("is-in"));
      }
    });
  }));

  /* ============ Campaign dashboards: filter by kind ============ */
  const dPills = $$("#dashPills .pill");
  const dashCards = $$(".dash-card");
  dPills.forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.kind;
    dPills.forEach((x) => x.classList.toggle("is-active", x === b));
    let i = 0;
    dashCards.forEach((c) => {
      const show = k === "all" || c.dataset.kind === k;
      c.hidden = !show;
      if (show) {
        c.style.setProperty("--i", i++ % 4);
        c.classList.remove("is-in");
        requestAnimationFrame(() => c.classList.add("is-in"));
      }
    });
  }));

  /* ============ Case studies: pipeline layers (typewriter) ============ */
  $$(".layers[data-layers]").forEach((layersEl) => {
    const layers = JSON.parse(layersEl.dataset.layers);
    const detail = $("[data-layer-detail]", layersEl.parentElement);
    let typeT;
    const showLayer = (i) => {
      $$(".layer", layersEl).forEach((b, k) => {
        b.classList.toggle("is-active", k === i);
        b.setAttribute("aria-pressed", k === i ? "true" : "false");
      });
      const l = layers[i];
      const head = `<b>[${pad(i + 1)}. ${l.name.toUpperCase()}]</b> `;
      clearTimeout(typeT);
      if (reduce) { detail.innerHTML = head + l.detail; return; }
      let n = 0;
      const type = () => {
        n = Math.min(n + 3, l.detail.length);
        detail.innerHTML = head + l.detail.slice(0, n) + (n < l.detail.length ? '<span class="caret"></span>' : "");
        if (n < l.detail.length) typeT = setTimeout(type, 12);
      };
      type();
    };
    $$(".layer", layersEl).forEach((b) => b.addEventListener("click", () => showLayer(+b.dataset.layer)));
  });

  /* ============ Image viewers (inline + lightbox) ============ */
  const swapImg = (img, src, alt) => {
    if (img.parentElement) img.parentElement.style.setProperty("--bg", `url('${new URL(src, location.href).href}')`);
    if (img.getAttribute("src") === src) return;
    img.classList.add("is-swapping");
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      setTimeout(() => { img.src = src; img.alt = alt; img.classList.remove("is-swapping"); }, reduce ? 0 : 180);
    };
    pre.src = src;
  };

  $$(".inline-viewer[data-viewer-key]").forEach((inline) => {
    const slidesIV = DATA.viewers[inline.dataset.viewerKey].slides;
    const mainImg = $("[data-main]", inline);
    mainImg.parentElement.style.setProperty("--bg", `url('${mainImg.src}')`);
    let idx = 0;
    const go = (i) => {
      idx = (i + slidesIV.length) % slidesIV.length;
      const s = slidesIV[idx];
      swapImg($("[data-main]", inline), asset(s.img), s.caption);
      $("[data-caption]", inline).textContent = s.caption;
      $("[data-counter]", inline).textContent = `${pad(idx + 1)} / ${pad(slidesIV.length)}`;
      $$(".thumb", inline).forEach((th, k) => th.classList.toggle("is-active", k === idx));
    };
    $("[data-prev]", inline).addEventListener("click", () => go(idx - 1));
    $("[data-next]", inline).addEventListener("click", () => go(idx + 1));
    $$(".thumb", inline).forEach((th) => th.addEventListener("click", () => go(+th.dataset.thumb)));
  });

  /* Modals */
  let lastFocus = null;
  const openModal = (m) => {
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => m.classList.add("is-open"));
    setTimeout(() => ($("[data-close]", m) || m).focus(), 50);
  };
  const closeModal = (m) => {
    m.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    setTimeout(() => { m.hidden = true; lastFocus && lastFocus.focus(); }, reduce ? 0 : 300);
  };
  $$(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close]")) closeModal(m); });
  });

  const lb = $("#lightbox");
  let lbSlides = [], lbIdx = 0, lbKey = "";
  const lbGo = (i) => {
    lbIdx = (i + lbSlides.length) % lbSlides.length;
    const s = lbSlides[lbIdx];
    swapImg($("#lbImg"), asset(s.img), s.caption);
    $("#lbCaption").textContent = s.caption;
    $("#lbCount").textContent = `${pad(lbIdx + 1)} / ${pad(lbSlides.length)}`;
    $$("#lbThumbs .thumb").forEach((th, k) => th.classList.toggle("is-active", k === lbIdx));
  };
  const openViewer = (key) => {
    const v = DATA.viewers[key];
    if (!v) return;
    lbKey = key;
    lbSlides = v.slides;
    $("#lbTitle").textContent = v.title;
    $("#lbNote").textContent = v.note || "";
    const thumbs = $("#lbThumbs");
    thumbs.style.setProperty("--n", Math.max(4, v.slides.length));
    thumbs.innerHTML = v.slides.map((s, i) =>
      `<button type="button" class="thumb" data-i="${i}" aria-label="Image ${i + 1}"><img src="${asset(s.img)}" alt=""></button>`).join("");
    $$(".thumb", thumbs).forEach((th) => th.addEventListener("click", () => lbGo(+th.dataset.i)));
    $("#lbImg").src = asset(v.slides[0].img);
    lbIdx = -1;
    lbGo(0);
    openModal(lb);
  };
  $("#lbPrev").addEventListener("click", () => lbGo(lbIdx - 1));
  $("#lbNext").addEventListener("click", () => lbGo(lbIdx + 1));
  $$("[data-viewer]").forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    openViewer(b.dataset.viewer);
  }));

  // swipe support in the lightbox
  let touchX = null;
  $(".lightbox__stage").addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  $(".lightbox__stage").addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) lbGo(lbIdx + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  const connect = $("#connect");
  $$("[data-open-connect]").forEach((b) => b.addEventListener("click", () => openModal(connect)));

  addEventListener("keydown", (e) => {
    const open = $(".modal.is-open");
    if (!open) return;
    if (e.key === "Escape") closeModal(open);
    if (open === lb && e.key === "ArrowRight") lbGo(lbIdx + 1);
    if (open === lb && e.key === "ArrowLeft") lbGo(lbIdx - 1);
  });

  /* ============ Credentials + LinkedIn drawer ============ */
  const items = {};
  DATA.credentials.forEach((c) => { items[c.id] = { ...c, kind: "cred" }; });
  DATA.linkedin.forEach((l) => {
    items[l.id] = { id: l.id, title: l.title, full: l.full, issuer: "Shared on LinkedIn", type: "LinkedIn post",
      date: "Featured", art: l.img, desc: l.desc, url: l.url, cta: l.cta, brand: "LinkedIn", kind: "li" };
  });
  const drawer = $("#drawer");
  const credsGrid = $(".creds__grid");
  const credCards = $$(".cred[data-cred]", $("#credGrid"));
  const icoBook = $(".cred__type .ic") ? $(".cred__type .ic").outerHTML : "";
  const icoCal = '<svg class="ic" width="15" height="15" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
  let currentTab = "featured";

  const showItem = (id, scroll) => {
    const c = items[id];
    if (!c) return;
    credsGrid.classList.remove("drawer-closed");
    drawer.hidden = false;
    $("#drawerArt").src = asset(c.art);
    $("#drawerArt").alt = c.title;
    $("#drawerTitle").textContent = c.full || c.title;
    $("#drawerIssuer").textContent = c.issuer;
    $("#drawerDesc").textContent = c.desc;
    $("#drawerType").innerHTML = `${icoBook} ${c.type}`;
    $("#drawerDate").innerHTML = `${icoCal} ${c.date}`;
    const cta = $("#drawerCta");
    cta.href = c.url;
    $("span", cta).textContent = c.cta || "View";
    $$("[data-cred]").forEach((el) => el.classList.toggle("is-active", el.dataset.cred === id && el.id !== "drawerRelated"));

    // related: next featured/visible credential that's not this one
    const pool = DATA.credentials.filter((x) => x.id !== id && (c.kind === "li" ? x.featured : x.tab === (c.tab || "cert")));
    const rel = pool.length ? pool[Math.max(0, DATA.credentials.findIndex((x) => x.id === id)) % pool.length] : null;
    const relEl = $("#drawerRelated");
    if (rel) {
      relEl.dataset.cred = rel.id;
      relEl.innerHTML = `<img src="${asset(rel.art)}" alt="" class="cred__art"><span class="cred__fade"></span>
        <span class="cred__body"><span class="cred__brand">${rel.brand}</span><span class="cred__title">${rel.title}</span>
        <span class="cred__issuer">${rel.issuer}</span></span><span class="cred__arrow">↗</span>`;
    }
    drawer.classList.remove("is-updating");
    void drawer.offsetWidth;
    drawer.classList.add("is-updating");
    if (scroll && innerWidth <= 1024) drawer.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const showTab = (tab) => {
    currentTab = tab;
    $$("[data-cred-tab]").forEach((b) => b.classList.toggle("is-active", b.dataset.credTab === tab));
    let i = 0;
    credCards.forEach((c) => {
      const show = tab === "featured" ? c.dataset.featured === "true" : c.dataset.tab === tab;
      c.hidden = !show;
      if (show) {
        c.style.setProperty("--i", i++);
        c.style.animation = "none"; void c.offsetWidth; c.style.animation = "";
      }
    });
  };
  $$("[data-cred-tab]").forEach((b) => b.addEventListener("click", () => {
    showTab(b.dataset.credTab);
    const first = credCards.find((c) => !c.hidden);
    if (first) showItem(first.dataset.cred, false);
  }));
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-cred]");
    if (el) showItem(el.dataset.cred, true);
  });
  $("#drawerClose").addEventListener("click", () => {
    $$("[data-cred]").forEach((el) => el.classList.remove("is-active"));
    credsGrid.classList.add("drawer-closed");
    drawer.hidden = true;
  });
  showTab("featured");
  showItem("voc", false);

  $("#copyLink").addEventListener("click", async (e) => {
    const url = e.currentTarget.dataset.copy;
    try { await navigator.clipboard.writeText(url); toast("LinkedIn link copied"); }
    catch { toast(url); }
  });

  /* ============ Contact form ============ */
  const form = $("#contactForm");
  const status = $("#formStatus");
  const isStatic = document.body.dataset.static === "true";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    status.className = "form__status";
    if (!d.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) || !d.message.trim()) {
      status.textContent = "Please add your name, a valid email and a message.";
      status.classList.add("err");
      return;
    }
    const mailto = () => {
      location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent("Portfolio enquiry from " + d.name)}&body=${encodeURIComponent(d.message + "\n\n" + d.name + " · " + d.email)}`;
    };
    if (isStatic) { mailto(); return; }
    const label = $("button[type=submit] span", form);
    label.textContent = "Sending…";
    try {
      const res = await fetch("api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error);
      status.textContent = "Thanks! I'll get back to you soon.";
      status.classList.add("ok");
      form.reset();
    } catch {
      status.textContent = "Couldn't send. Opening your email app instead…";
      status.classList.add("err");
      setTimeout(mailto, 900);
    } finally {
      label.textContent = "Send message";
    }
  });
})();
