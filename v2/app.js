(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const { profile, socials, stats, featuredWork, photography, tutorials, resources } = data;

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (v = "") => String(v).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[c]));
  const asset = (p) => (/^(https?:)?\/\//.test(p) ? p : "../" + p);
  const safeHref = (h) => (h && /^(https?:\/\/|mailto:|#)/i.test(h) ? h : "");
  const ext = (h) => (/^https?:\/\//i.test(h) ? ' target="_blank" rel="noopener noreferrer"' : "");

  const PORTRAIT = "assets/portrait.webp";

  const NAV = [
    { href: "#about", label: "认识我" },
    { href: "#work", label: "代表作" },
    { href: "#hub", label: "AI 小站" },
    { href: "#life", label: "日常" },
    { href: "#contact", label: "联系" },
  ];

  function renderNav() {
    $("#nav").innerHTML = NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join("");
    const btn = $("#menu-toggle");
    const header = $(".topbar");
    btn.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    $("#nav").addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        header.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  function renderHero() {
    $("#hero-role-en").textContent = profile.roleEn;
    $("#hero-title").innerHTML =
      `<span class="hero__name">${esc(profile.name)}</span>` +
      `<span class="hero__alias">${esc(profile.nameEn)}</span>` +
      `<span class="hero__role">${esc(profile.role)}</span>`;
    $("#hero-lead").textContent = profile.value;
    const img = $("#hero-photo");
    img.src = PORTRAIT;
    img.alt = profile.photoAlt;
    $("#hero-caption").textContent = profile.legalName + " · " + profile.nameEn;

    $("#hero-stats").innerHTML = [
      [stats.total + "+", stats.label],
      [String(socials.length), "内容平台"],
      [String(tutorials.length + resources.length), "教程与资源"],
    ].map(([v, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join("");

    const items = profile.mottos.concat(profile.mottos);
    $("#marquee").innerHTML = items.concat(items).map((m) => `<span>${esc(m)}</span><i>✦</i>`).join("");
  }

  function renderSocials() {
    $("#stats-note").textContent = `数据更新于 ${stats.updatedAt} · ${stats.note}`;
    const total = `<div class="social social--total">
        <p class="social__label">${esc(stats.label)}</p>
        <p class="social__metric">${esc(stats.total)}<small>+</small></p>
        <p class="social__meta">更新于 ${esc(stats.updatedAt)}</p>
      </div>`;
    const cards = socials.map((s) => {
      const href = safeHref(s.href);
      const live = s.status === "LIVE";
      const tag = href ? "a" : "div";
      const attrs = href ? ` href="${esc(href)}"${ext(href)}` : ' aria-disabled="true"';
      return `<${tag} class="social${live ? " is-live" : ""}${href ? "" : " is-muted"}"${attrs}>
          <div class="social__top">
            <span class="social__icon" data-id="${esc(s.id)}">${esc(s.icon)}</span>
            <span class="tag${live ? " tag--live" : ""}"><span class="dot"></span>${live ? "LIVE" : "SOON"}</span>
          </div>
          <p class="social__name">${esc(s.name)}</p>
          <p class="social__handle">${esc(s.handle)}</p>
          <p class="social__metric">${esc(s.metric)}${s.metric !== "—" ? `<small>${esc(s.metricLabel)}</small>` : ""}</p>
          <p class="social__meta">${esc(s.updatedAt)}${href ? ' <span class="arrow" aria-hidden="true">↗</span>' : ""}</p>
        </${tag}>`;
    }).join("");
    $("#socials").innerHTML = total + cards;
  }

  function renderFeature() {
    const f = featuredWork;
    const href = safeHref(f.href);
    $("#feature").innerHTML = `
      <a class="feature__media" href="${esc(href)}"${ext(href)} aria-label="打开代表作：${esc(f.title)}">
        <img src="${esc(asset(f.cover))}" alt="${esc(f.coverAlt)}" loading="lazy" width="1200" height="480">
      </a>
      <div class="feature__body">
        <p class="feature__date">发布于 ${esc(f.publishedAt)} · 数据更新 ${esc(f.updatedAt)}</p>
        <h3>${esc(f.title)}</h3>
        <p class="feature__desc">${esc(f.description)}</p>
        <ul class="feature__metrics">${f.metrics.map((m) => {
          const [n, ...rest] = m.split(" ");
          return `<li><strong>${esc(n)}</strong><span>${esc(rest.join(" "))}</span></li>`;
        }).join("")}</ul>
        <a class="btn btn--primary" href="${esc(href)}"${ext(href)}>阅读全文 <span aria-hidden="true">↗</span></a>
      </div>`;
  }

  function hubItems(list) {
    return list.map((item, i) => {
      const href = safeHref(item.href);
      const inner = `
        <span class="hub__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="hub__main">
          <span class="hub__title">${esc(item.title)}</span>
          <span class="hub__note">${esc(item.note)}</span>
        </span>
        <span class="hub__meta">${esc(item.meta)}</span>
        <span class="hub__go">${href ? "打开 ↗" : esc(item.status || "即将上线")}</span>`;
      return href
        ? `<li><a class="hub__item" href="${esc(href)}"${ext(href)}>${inner}</a></li>`
        : `<li><div class="hub__item is-muted">${inner}</div></li>`;
    }).join("");
  }

  function renderHub() {
    $("#panel-tutorials").innerHTML = hubItems(tutorials);
    $("#panel-resources").innerHTML = hubItems(resources);
    const tabs = [...document.querySelectorAll("[role=tab]")];
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        $("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
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
  }

  function renderGallery() {
    $("#gallery").innerHTML = photography.map((p, i) => `
      <button class="gallery__item" type="button" data-src="${esc(asset(p.src))}" data-alt="${esc(p.alt)}" aria-label="查看大图：${esc(p.alt)}">
        <img src="${esc(asset(p.src))}" alt="${esc(p.alt)}" loading="lazy" width="1800" height="1200">
        <span class="gallery__idx">${String(i + 1).padStart(2, "0")}</span>
      </button>`).join("");
    const box = $("#lightbox");
    const boxImg = $("img", box);
    let last = null;
    const close = () => { box.hidden = true; document.body.style.overflow = ""; last?.focus(); };
    $("#gallery").addEventListener("click", (e) => {
      const item = e.target.closest(".gallery__item");
      if (!item) return;
      last = item;
      boxImg.src = item.dataset.src;
      boxImg.alt = item.dataset.alt;
      box.hidden = false;
      document.body.style.overflow = "hidden";
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
      <button class="contact__item" type="button" data-copy="${esc(profile.wechatId)}">
        <span>微信</span><strong>${esc(profile.wechatId)}</strong><em>点击复制</em>
      </button>
      <a class="contact__item" href="mailto:${esc(profile.email)}">
        <span>邮箱</span><strong>${esc(profile.email)}</strong><em>发送邮件 ↗</em>
      </a>`;
    $("#contact-actions").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      await copy(b.dataset.copy);
      toast("微信号已复制：" + b.dataset.copy);
    });
    $("#footer-name").textContent = `© ${new Date().getFullYear()} ${profile.name} / ${profile.nameEn}`;
    $("#footer-mottos").textContent = profile.mottos[0];
  }

  function initTheme() {
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    const current = () => root.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const sync = () => { meta.content = current() === "dark" ? "#0e0e10" : "#f6f5f1"; };
    sync();
    $("#theme-toggle").addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("qurious-theme", next);
      sync();
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal, .section__head, .socials > *, .feature, .hub, .gallery__item, .contact__card");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    els.forEach((el) => el.classList.add("will-reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
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
})();
