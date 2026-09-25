/* ============================================================
   阿晔 / QURIOUS — V2 · 暗夜电影感
   数据全部来自 ../content.js 的 window.PORTFOLIO_DATA
   ============================================================ */
(function () {
  var data = window.PORTFOLIO_DATA;
  var page = document.body.dataset.page || "home";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c];
    });
  };
  var safeHref = function (v) {
    if (!v) return "";
    var h = String(v).trim();
    return /^(https?:\/\/|mailto:|#|[\w.-]+\.html)/i.test(h) ? h : "";
  };
  var extAttrs = function (h) {
    return /^https?:\/\//i.test(h) ? ' target="_blank" rel="noopener noreferrer"' : "";
  };
  /* 资源路径相对站点根目录 */
  var asset = function (p) {
    return String(p || "");
  };

  if (!data) {
    document.getElementById("app").innerHTML =
      '<p style="padding:30vh 5vw;text-align:center;color:#948b7b;letter-spacing:.2em">未找到 content.js 数据</p>';
    return;
  }

  /* ---------- 导航 ---------- */
  function renderNav() {
    var nav = $("#site-nav");
    if (!nav) return;
    var home = page === "home";
    var links = data.nav.map(function (item) {
      var href = item.href || "#" + item.id;
      if (!item.href && !home) href = "index.html#" + item.id;
      var current = (!home && item.id === "ai-hub") ? ' aria-current="page" class="is-active"' : "";
      return '<a data-target="' + esc(item.id) + '" href="' + esc(href) + '"' + current + extAttrs(href) + ">" + esc(item.label) + "</a>";
    }).join("");
    nav.className = "nav";
    nav.innerHTML =
      '<a class="wordmark" href="' + (home ? "#top" : "index.html") + '" aria-label="回到首页"><b>阿晔</b><span>/</span>QURIOUS</a>' +
      '<nav class="nav-links" aria-label="主导航">' + links + "</nav>" +
      '<span class="nav-status"><i></i>OPEN TO CREATE</span>' +
      '<button class="menu-btn" type="button" aria-expanded="false">菜单</button>';

    var menuBtn = $(".menu-btn", nav);
    var mnav = $("#mnav");
    if (mnav) {
      var mlinks = data.nav.map(function (item, i) {
        var href = item.href || (home ? "#" + item.id : "index.html#" + item.id);
        return '<a href="' + esc(href) + '"' + extAttrs(href) + ' style="transition-delay:' + (i * 60 + 80) + 'ms">' +
          "<i>0" + (i + 1) + "</i>" + esc(item.label) + "</a>";
      }).join("");
      mnav.innerHTML = mlinks + '<p class="mnav-foot">阿晔 / QURIOUS — AI 实践者 · 内容创作者</p>';
      menuBtn.addEventListener("click", function () {
        var open = mnav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.textContent = open ? "关闭" : "菜单";
        document.body.style.overflow = open ? "hidden" : "";
      });
      $$("a", mnav).forEach(function (a) {
        a.addEventListener("click", function () {
          mnav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.textContent = "菜单";
          document.body.style.overflow = "";
        });
      });
    }

    /* 滚动态 */
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 50); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 平台行 ---------- */
  function socialRows() {
    return data.socials.map(function (s, i) {
      var href = safeHref(s.href);
      var live = s.status === "LIVE";
      var tag = href ? "a" : (s.copy ? "button" : "div");
      var attrs = href
        ? ' href="' + esc(href) + '"' + extAttrs(href)
        : (s.copy
          ? ' type="button" data-copy="' + esc(s.copy) + '" data-label="公众号名" title="点击复制公众号名"'
          : ' aria-disabled="true"');
      return "<" + tag + ' class="srow' + (live ? "" : " soon") + '"' + attrs + ">" +
        '<span class="s-idx">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="s-name">' + esc(s.name) + "<i>" + esc(s.handle) + "</i></span>" +
        '<span class="s-metric">' + esc(s.metric) + "<em>" + esc(s.metricLabel) + "</em></span>" +
        '<span class="s-status' + (live ? " on" : "") + '"><b></b>' + esc(s.status) + "</span>" +
        '<span class="s-arrow">' + (href ? "↗" : (s.copy ? "⧉" : "")) + "</span>" +
        "</" + tag + ">";
    }).join("");
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    var p = data.profile, w = data.featuredWork, st = data.stats;
    var mottos = data.profile.mottos.map(function (m) {
      return "<span>" + esc(m) + "<b>·</b></span>";
    }).join("");

    $("#app").innerHTML =
      /* HERO */
      '<header class="hero" id="top">' +
        '<div class="wrap hero-grid">' +
          '<div class="hero-copy">' +
            '<p class="eyebrow reveal"><i></i>个人主页 · PERSONAL PORTFOLIO — VOL.01</p>' +
            '<h1 class="serif reveal">' + esc(p.name) + '<span class="en">' + esc(p.nameEn) + "</span></h1>" +
            '<p class="role reveal">' + esc(p.role) + "</p>" +
            '<p class="value reveal">&ldquo;' + esc(p.value) + "&rdquo;</p>" +
            '<div class="hero-cta reveal">' +
              '<a class="btn solid" href="#about">认识我 ↓</a>' +
              '<a class="btn" href="#work">代表作 ↓</a>' +
              '<span class="scroll-hint">SCROLL<i></i></span>' +
            "</div>" +
          "</div>" +
          '<figure class="hero-fig" id="heroFig">' +
            '<div class="halo" id="halo"></div>' +
            '<img src="assets/source/profile-original-cutout.png" alt="' + esc(p.photoAlt) + '" id="cutout">' +
            '<span class="floor"></span>' +
            '<figcaption class="fig-caption">' + esc(p.legalName) + " · HE CHENYE — EST. 2026</figcaption>" +
          "</figure>" +
        "</div>" +
        '<div class="marquee" aria-hidden="true"><div class="marquee-track">' + mottos + mottos + "</div></div>" +
      "</header>" +

      /* 认识我 */
      '<section class="block" id="about"><div class="wrap">' +
        '<div class="sec-head reveal"><span class="sec-num">02</span><h2 class="sec-title serif">认识我</h2><span class="sec-en">ABOUT — SIGNALS</span></div>' +
        '<div class="about-grid">' +
          '<div class="about-copy reveal">' +
            '<p class="lead">把复杂的 AI 工具，翻译成任何人都能跟着做的实操指南。</p>' +
            "<p>我是" + esc(p.name) + "，也叫 " + esc(p.nameEn) + "。白天研究 AI 工具的真实用法，晚上把踩过的坑写成教程。不关心发布会上的宏大叙事，只在意一个工具今天能不能帮你省下一小时。</p>" +
            '<p style="margin-top:2vh">目前活跃于 X、B 站、小红书与抖音，公众号 Qurious 同步更新。已确认平台粉丝合计 <b class="serif total-num">' + esc(st.total) + "</b>。</p>" +
            '<p class="stats-note">' + esc(st.label) + " · 更新于 " + esc(st.updatedAt) + " — " + esc(st.note) + "</p>" +
            '<div class="sig"><span>' + esc(p.name) + " / " + esc(p.nameEn) + "</span><i></i><span>EST.2026</span></div>" +
          "</div>" +
          '<div class="reveal">' + socialRows() + "</div>" +
        "</div>" +
      "</div></section>" +

      /* 代表作 */
      '<section class="block" id="work" style="background:var(--bg2)"><div class="wrap">' +
        '<div class="sec-head reveal"><span class="sec-num">03</span><h2 class="sec-title serif">代表作</h2><span class="sec-en">SELECTED WORKS</span></div>' +
        '<div class="work-feature">' +
          '<a class="work-still reveal" href="' + esc(safeHref(w.href)) + '"' + extAttrs(w.href) + ">" +
            '<img class="cover" src="' + esc(asset(w.cover)) + '" alt="' + esc(w.coverAlt) + '">' +
            '<span class="still-cap"><i>STILL 01</i>X 长文封面 · 点击阅读原文 ↗</span>' +
          "</a>" +
          '<div class="work-info reveal">' +
            '<p class="tagline">FEATURED · 代表作 · X</p>' +
            '<h3 class="serif">' + esc(w.title) + "</h3>" +
            "<p>" + esc(w.description) + " 发布于 " + esc(w.publishedAt) + "。</p>" +
            '<div class="chips">' + w.metrics.map(function (m) { return '<span class="chip">' + esc(m) + "</span>"; }).join("") + "</div>" +
            '<a class="work-open" href="' + esc(safeHref(w.href)) + '"' + extAttrs(w.href) + ">阅读原文 ↗</a>" +
          "</div>" +
        "</div>" +
        '<div class="work-sub">' +
          (data.works || []).map(function (wk, i) {
            var href = safeHref(wk.href);
            var tag = href ? "a" : "div";
            var attrs = href ? ' href="' + esc(href) + '"' + extAttrs(href) : "";
            return "<" + tag + ' class="wrow reveal"' + attrs + ">" +
              '<span class="w-idx">W' + String(i + 2).padStart(2, "0") + "</span>" +
              '<span class="w-tag">' + esc(wk.platform) + "</span>" +
              '<span class="w-title">' + esc(wk.title) + "<em>" + esc(wk.note) + "</em></span>" +
              '<span class="w-arrow">' + (href ? "↗" : "") + "</span>" +
              "</" + tag + ">";
          }).join("") +
        "</div>" +
      "</div></section>" +

      /* 我的AI小站 */
      '<section class="block" id="ai-hub"><div class="wrap">' +
        '<div class="sec-head reveal"><span class="sec-num">04</span><h2 class="sec-title serif">我的AI小站</h2><span class="sec-en">AI HUB — 独立分站</span></div>' +
        '<div class="hub-preview">' +
          '<div class="hub-intro reveal">' +
            '<p class="lead">把教程、工具和可复用资源，整理成一个长期更新的入口。</p>' +
            "<p>不追新，只留真正用得上的。教程喂饭级，资源即拿即用。</p>" +
            '<p class="hub-counts"><b>' + data.tutorials.length + "</b> 篇教程<i></i><b>" + data.resources.length + "</b> 项资源</p>" +
            '<a class="btn solid" href="ai-hub.html">进入 AI 小站 ↗</a>' +
          "</div>" +
          '<div class="hub-list reveal">' + hubMiniRows() + "</div>" +
        "</div>" +
      "</div></section>";
  }

  /* 首页小站预览行：教程在前，资源在后，统一编号 */
  function hubMiniRows() {
    var items = data.tutorials.concat(data.resources);
    return items.map(function (item, i) {
      var href = safeHref(item.href);
      var isRes = item.type === "资源";
      var inner =
        '<span class="m-idx">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="m-tag' + (isRes ? " res" : "") + '">' + esc(item.type) + "</span>" +
        '<span class="m-title">' + esc(item.title) + "</span>" +
        '<span class="m-arrow">' + (href ? "↗" : '<span class="m-pending">' + esc(item.status || "待补") + "</span>") + "</span>";
      return href
        ? '<a class="mrow" href="' + esc(href) + '"' + extAttrs(href) + ">" + inner + "</a>"
        : '<div class="mrow off">' + inner + "</div>";
    }).join("");
  }

  /* ---------- AI 小站 ---------- */
  function hubRows(items) {
    return items.map(function (item, i) {
      var href = safeHref(item.href);
      var inner =
        '<span class="hub-idx">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<div>" +
          '<span class="hub-meta">' + esc(item.meta) + " · " + esc(item.type) + "</span>" +
          "<h3>" + esc(item.title) + "</h3>" +
          '<p class="note">' + esc(item.note) + "</p>" +
        "</div>" +
        (href
          ? '<span class="hub-go">打开入口 ↗</span>'
          : '<span class="hub-go pending">' + esc(item.status || "待补链接") + "</span>");
      return href
        ? '<a class="hub-row reveal" href="' + esc(href) + '"' + extAttrs(href) + ">" + inner + "</a>"
        : '<div class="hub-row reveal">' + inner + "</div>";
    }).join("");
  }

  function renderHub() {
    $("#app").innerHTML =
      '<section class="hub-hero"><span class="ghost" aria-hidden="true">AI</span>' +
        '<div class="wrap hub-hero-copy">' +
          '<p class="eyebrow reveal"><i></i>04 · 独立小站 — 长期整理</p>' +
          '<h1 class="serif reveal">AI 小站<span class="en">PRACTICAL AI NOTES &amp; RESOURCES</span></h1>' +
          '<p class="hub-intro reveal">把教程、工具和可复用资源整理成一个长期更新的入口。不追新，只留真正用得上的。</p>' +
        "</div>" +
      "</section>" +
      '<section class="hub-sec" id="tutorials"><div class="wrap">' +
        '<div class="hub-sec-head reveal"><span class="n">SECTION 01</span><h2>教程区</h2><span class="en">TUTORIALS</span></div>' +
        hubRows(data.tutorials) +
      "</div></section>" +
      '<section class="hub-sec" id="resources" style="background:var(--bg2)"><div class="wrap">' +
        '<div class="hub-sec-head reveal"><span class="n">SECTION 02</span><h2>资源区</h2><span class="en">RESOURCES</span></div>' +
        hubRows(data.resources) +
        '<p class="hub-foot-note">持续整理中 — 有想看的教程可以<a href="mailto:' + esc(data.profile.email) + '">写邮件告诉我</a></p>' +
      "</div></section>";
  }

  /* ---------- 页脚 ---------- */
  function renderFooter() {
    var f = $("#site-footer");
    if (!f) return;
    var p = data.profile;
    f.innerHTML =
      '<div class="wrap">' +
        '<a class="foot-title serif reveal" href="#top" aria-label="回到顶部">' + esc(p.nameEn) + "</a>" +
        '<div class="foot-links reveal">' +
          '<a href="mailto:' + esc(p.email) + '">' + esc(p.email) + "</a>" +
          '<button type="button" data-copy="' + esc(p.wechatId) + '" data-label="微信号">微信 · ' + esc(p.wechatId) + "</button>" +
          '<a href="#top">回到顶部 ↑</a>' +
        "</div>" +
        '<p class="colophon">© 2026 ' + esc(p.name) + " / " + esc(p.nameEn) + " — SLOW IS FAST.</p>" +
      "</div>";
  }

  /* ---------- 入场 ---------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("on"); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    var i = 0;
    els.forEach(function (el) { el.style.transitionDelay = (i++ % 5) * 70 + "ms"; io.observe(el); });
  }

  /* ---------- 导航 scrollspy ---------- */
  function initSpy() {
    if (page !== "home" || !("IntersectionObserver" in window)) return;
    var links = $$(".nav-links a[data-target]");
    if (!links.length) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle("is-active", l.dataset.target === e.target.id); });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    ["about", "work", "ai-hub"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- Hero 视差 + 光晕 ---------- */
  function initHero() {
    var fig = $("#heroFig"), cut = $("#cutout"), halo = $("#halo");
    if (!fig || !cut || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.addEventListener("scroll", function () {
      var y = Math.min(window.scrollY, window.innerHeight);
      cut.style.transform = "translateY(" + y * 0.10 + "px)";
    }, { passive: true });
    window.addEventListener("pointermove", function (e) {
      var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      halo.style.setProperty("--hx", x * 40 + "px");
      halo.style.setProperty("--hy", y * 24 + "px");
      cut.style.translate = x * -10 + "px " + y * -6 + "px";
    }, { passive: true });
  }

  /* ---------- 复制 ---------- */
  function initCopy() {
    var toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
    $$("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var done = function () {
          toast.textContent = (btn.dataset.label || "内容") + "已复制：" + btn.dataset.copy;
          toast.classList.add("show");
          setTimeout(function () { toast.classList.remove("show"); }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(btn.dataset.copy).then(done).catch(done);
        } else {
          var t = document.createElement("textarea");
          t.value = btn.dataset.copy; t.style.cssText = "position:fixed;opacity:0";
          document.body.appendChild(t); t.select();
          try { document.execCommand("copy"); } catch (e) {}
          t.remove(); done();
        }
      });
    });
  }

  /* ---------- hash 定位 ---------- */
  function initHash() {
    if (!window.location.hash) return;
    var t = document.querySelector(window.location.hash);
    if (t) setTimeout(function () {
      window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY);
    }, 80);
  }

  /* ---------- 启动 ---------- */
  renderNav();
  if (page === "ai-hub") renderHub(); else renderHome();
  renderFooter();
  initReveal();
  initSpy();
  initHero();
  initCopy();
  initHash();
})();
