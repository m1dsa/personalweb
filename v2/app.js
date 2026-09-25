(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const { profile, socials, stats, featuredWork, photography, tutorials, resources } = data;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (v = "") => String(v).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[c]));
  const asset = (p) => (/^(https?:)?\/\//.test(p) ? p : "../" + p);
  const safeHref = (h) => (h && /^(https?:\/\/|mailto:|#)/i.test(h) ? h : "");
  const ext = (h) => (/^https?:\/\//i.test(h) ? ' target="_blank" rel="noopener noreferrer"' : "");
  const pad = (n) => String(n).padStart(2, "0");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const PORTRAIT = "assets/portrait.webp";
  const NAV = [
    { href: "#about", label: "认识我" },
    { href: "#work", label: "代表作" },
    { href: "#hub", label: "AI 小站" },
    { href: "#life", label: "日常" },
    { href: "#contact", label: "联系" },
  ];

  function renderNav() {
    $("#nav").innerHTML = NAV.map((n, i) =>
      `<a href="${n.href}"><span class="mono">${pad(i + 1)}</span>${esc(n.label)}</a>`).join("");
    const btn = $("#menu-toggle");
    const header = $(".topbar");
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    };
    btn.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
    $("#nav").addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 12);
      header.classList.toggle("is-hidden", y > 480 && y > lastY && !header.classList.contains("is-open"));
      lastY = y;
    }, { passive: true });

    const links = $$("#nav a");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((n) => { const s = $(n.href); if (s) spy.observe(s); });
  }

  function renderHero() {
    $("#hero-role-en").textContent = profile.roleEn;
    $("#hero-year").textContent = "©" + new Date().getFullYear();
    $("#hero-name").textContent = profile.name;
    $("#hero-alias").textContent = profile.nameEn.charAt(0) + profile.nameEn.slice(1).toLowerCase();
    $("#hero-role").textContent = profile.role;
    $("#hero-lead").textContent = profile.value;
    const img = $("#hero-photo");
    img.src = PORTRAIT;
    img.alt = profile.photoAlt;

    const items = profile.mottos.map((m) => `<span>${esc(m.replace(/\.$/, ""))}</span><i aria-hidden="true">✳</i>`).join("");
    $("#marquee").innerHTML = items.repeat(4);
  }

  function renderSocials() {
    $("#total-count").dataset.to = stats.total.replace(/,/g, "");
    $("#total-count").textContent = stats.total;
    $("#total-label").textContent = stats.label;
    $("#stats-note").textContent = `更新于 ${stats.updatedAt} — ${stats.note}`;
    $("#socials").innerHTML = socials.map((s, i) => {
      const href = safeHref(s.href);
      const live = s.status === "LIVE";
      const hasMetric = s.metric && s.metric !== "—";
      const tag = href ? "a" : "div";
      const attrs = href ? ` href="${esc(href)}"${ext(href)}` : "";
      return `<li><${tag} class="platform${href ? "" : " is-muted"}"${attrs}>
          <span class="platform__idx mono">${pad(i + 1)}</span>
          <span class="platform__name">${esc(s.name)}<small>${esc(s.handle)}</small></span>
          <span class="platform__metric">${hasMetric
            ? `<span class="count" data-to="${esc(s.metric.replace(/,/g, ""))}">${esc(s.metric)}</span><small>${esc(s.metricLabel)}</small>`
            : `<span class="platform__pending">${esc(s.updatedAt)}</span>`}</span>
          <span class="platform__status mono${live ? " is-live" : ""}"><i></i>${live ? "Live" : "Soon"}</span>
          <span class="platform__go" aria-hidden="true">${href ? "↗" : ""}</span>
        </${tag}></li>`;
    }).join("");
  }

  function renderFeature() {
    const f = featuredWork;
    const href = safeHref(f.href);
    $("#feature").innerHTML = `
      <a class="feature__media" href="${esc(href)}"${ext(href)} aria-label="打开代表作：${esc(f.title)}">
        <img src="${esc(asset(f.cover))}" alt="${esc(f.coverAlt)}" loading="lazy" width="1200" height="480">
        <span class="feature__badge mono">Featured · ${esc(f.publishedAt)}</span>
      </a>
      <div class="feature__body">
        <div class="feature__text">
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.description)}</p>
          <a class="link link--arrow" href="${esc(href)}"${ext(href)}>阅读全文 <i aria-hidden="true">↗</i></a>
        </div>
        <dl class="feature__metrics">${f.metrics.map((m) => {
          const [n, ...rest] = m.split(" ");
          return `<div><dt>${esc(rest.join(" "))}</dt><dd><span class="count" data-to="${esc(n.replace(/,/g, ""))}">${esc(n)}</span></dd></div>`;
        }).join("")}</dl>
      </div>
      <p class="feature__foot mono">数据更新于 ${esc(f.updatedAt)}</p>`;
  }

  function hubItems(list) {
    return list.map((item, i) => {
      const href = safeHref(item.href);
      const inner = `
        <span class="hub__idx mono">${pad(i + 1)}</span>
        <span class="hub__title">${esc(item.title)}</span>
        <span class="hub__note">${esc(item.note)}</span>
        <span class="hub__meta mono">${esc(item.meta)}</span>
        <span class="hub__go">${href ? '<i aria-hidden="true">↗</i>' : `<em>${esc(item.status || "即将上线")}</em>`}</span>`;
      return href
        ? `<li><a class="hub__item" href="${esc(href)}"${ext(href)}>${inner}</a></li>`
        : `<li><div class="hub__item is-muted">${inner}</div></li>`;
    }).join("");
  }

  function renderHub() {
    $("#panel-tutorials").innerHTML = hubItems(tutorials);
    $("#panel-resources").innerHTML = hubItems(resources);
    const tabs = $$("[role=tab]");
    const ink = $(".tabs__ink");
    const moveInk = (tab) => {
      ink.style.width = tab.offsetWidth + "px";
      ink.style.transform = `translateX(${tab.offsetLeft}px)`;
    };
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = $("#" + t.getAttribute("aria-controls"));
        panel.hidden = !on;
        if (on) panel.classList.remove("is-in"), requestAnimationFrame(() => panel.classList.add("is-in"));
      });
      moveInk(tab);
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        select(next);
      });
    });
    const init = () => moveInk(tabs.find((t) => t.getAttribute("aria-selected") === "true"));
    document.fonts ? document.fonts.ready.then(init) : init();
    window.addEventListener("resize", init);
    $("#panel-tutorials").classList.add("is-in");
  }

  function renderGallery() {
    $("#gallery").innerHTML = photography.map((p, i) => `
      <figure class="shot">
        <button class="shot__btn" type="button" data-src="${esc(asset(p.src))}" data-alt="${esc(p.alt)}" aria-label="查看大图：${esc(p.alt)}">
          <img src="${esc(asset(p.src))}" alt="${esc(p.alt)}" loading="lazy" width="1800" height="1200">
        </button>
        <figcaption><span class="mono">${pad(i + 1)}</span>${esc(p.alt.replace(/的摄影作品$/, ""))}</figcaption>
      </figure>`).join("");
    const box = $("#lightbox");
    const boxImg = $("img", box);
    const cap = $(".lightbox__cap", box);
    let last = null;
    const close = () => {
      box.classList.remove("is-on");
      document.body.classList.remove("menu-open");
      setTimeout(() => { box.hidden = true; }, reduced ? 0 : 300);
      last?.focus();
    };
    $("#gallery").addEventListener("click", (e) => {
      const item = e.target.closest(".shot__btn");
      if (!item) return;
      last = item;
      boxImg.src = item.dataset.src;
      boxImg.alt = item.dataset.alt;
      cap.textContent = item.dataset.alt;
      box.hidden = false;
      document.body.classList.add("menu-open");
      requestAnimationFrame(() => box.classList.add("is-on"));
      $(".lightbox__close", box).focus();
    });
    box.addEventListener("click", (e) => { if (e.target !== boxImg) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) close(); });
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("is-on"), 2200);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }

  function renderContact() {
    $("#contact-actions").innerHTML = `
      <a class="contact__item" href="mailto:${esc(profile.email)}">
        <span class="mono">Email</span>
        <strong>${esc(profile.email)}</strong>
        <em>发送邮件 ↗</em>
      </a>
      <button class="contact__item" type="button" data-copy="${esc(profile.wechatId)}">
        <span class="mono">WeChat</span>
        <strong>${esc(profile.wechatId)}</strong>
        <em>点击复制微信号</em>
      </button>`;
    $("#contact-actions").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      await copy(b.dataset.copy);
      toast("已复制微信号 " + b.dataset.copy);
    });
    $("#footer-name").textContent = `© ${new Date().getFullYear()} ${profile.name} / ${profile.nameEn}`;
    $("#footer-mottos").textContent = profile.mottos.join("  ·  ");
  }

  function initTheme() {
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    const current = () => root.dataset.theme ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const sync = () => { meta.content = current() === "light" ? "#f2f0eb" : "#0b0b0c"; };
    sync();
    $("#theme-toggle").addEventListener("click", () => {
      const next = current() === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("qurious-theme", next);
      sync();
    });
  }

  function countUp(el) {
    const to = Number(el.dataset.to);
    if (!Number.isFinite(to) || reduced) return;
    const dur = 1400;
    const start = performance.now();
    const fmt = (n) => Math.round(n).toLocaleString("en-US");
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initReveal() {
    const els = $$(".section__head, .about__total, .platforms li, .feature, .hub__item, .shot, .contact .kicker, .contact__title, .contact__item, .footer__big");
    requestAnimationFrame(() => document.body.classList.add("is-loaded"));
    if (reduced || !("IntersectionObserver" in window)) return;
    els.forEach((el) => el.classList.add("rv"));
    $$(".platforms li").forEach((el, i) => el.style.setProperty("--d", i * 70 + "ms"));
    $$(".hub").forEach((h) => $$(".hub__item", h).forEach((el, i) => el.style.setProperty("--d", i * 80 + "ms")));
    $$(".shot").forEach((el, i) => el.style.setProperty("--d", i * 100 + "ms"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        $$(".count", en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
  }

  function initPointer() {
    if (!finePointer || reduced) return;
    const cursor = $(".cursor");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    window.addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add("is-on");
      const t = e.target.closest("a, button");
      cursor.classList.toggle("is-hover", !!t);
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();

    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.25;
        const dy = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    const portrait = $(".hero__portrait");
    const glow = $(".hero__glow");
    const hero = $(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      portrait.style.setProperty("--px", px.toFixed(3));
      portrait.style.setProperty("--py", py.toFixed(3));
      glow.style.setProperty("--gx", (50 + px * 30).toFixed(1) + "%");
      glow.style.setProperty("--gy", (45 + py * 20).toFixed(1) + "%");
    });
  }

  renderNav();
  renderHero();
  renderSocials();
  renderFeature();
  renderHub();
  renderGallery();
  renderContact();
  initTheme();
  initReveal();
  initPointer();
})();
