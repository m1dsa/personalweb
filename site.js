(() => {
  const data = window.PORTFOLIO_DATA;
  const page = document.body.dataset.page || "home";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[char]));
  const safeHref = (value) => {
    if (!value) return "";
    const href = String(value).trim();
    return /^(https?:\/\/|mailto:|#|index\.html)/i.test(href) ? href : "";
  };
  const externalAttrs = (href) => /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
  const arrow = '<span class="ui-arrow" aria-hidden="true">↗</span>';

  function renderNav() {
    const nav = $("#site-nav");
    if (!nav) return;
    nav.className = page === "ai-hub" ? "site-nav site-nav--hub" : "site-nav";
    const links = data.nav.map((item) => {
      let href = item.href || ("#" + item.id);
      if (!item.href && page === "ai-hub") href = "index.html#" + item.id;
      const current = (page === "ai-hub" ? item.id === "ai-hub" : false) ? ' aria-current="page"' : "";
      const blank = externalAttrs(href);
      return '<a class="nav-link" data-nav-target="' + escapeHTML(item.id) + '" href="' + escapeHTML(href) + '"' + current + blank + ">" + escapeHTML(item.label) + "</a>";
    }).join("");
    nav.innerHTML = '<a class="wordmark" href="' + (page === "ai-hub" ? "index.html" : "#top") + '" aria-label="回到首页">阿晔 <span>/</span> QURIOUS</a><button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-nav">菜单</button><nav id="primary-nav" class="nav-links" aria-label="主导航">' + links + "</nav>";
    const menuButton = $(".menu-button", nav);
    menuButton?.addEventListener("click", () => {
      const open = nav.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "关闭" : "菜单";
    });
    $$(".nav-link", nav).forEach((link) => link.addEventListener("click", (event) => {
      nav.classList.remove("menu-open");
      menuButton?.setAttribute("aria-expanded", "false");
      if (menuButton) menuButton.textContent = "菜单";
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      event.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
      history.replaceState(null, "", href);
    }));
  }

  function renderFooter() {
    const footer = $("#site-footer");
    if (!footer || page === "ai-hub") {
      if (footer) footer.remove();
      return;
    }
    footer.innerHTML = '<div class="footer-brand"><span class="tiny-label">PERSONAL IP</span><strong>阿晔 <i>/</i> QURIOUS</strong><p>' + escapeHTML(data.profile.role) + '</p></div><div class="footer-contact"><span class="tiny-label">CONTACT</span><a href="mailto:' + escapeHTML(data.profile.email) + '">' + escapeHTML(data.profile.email) + '</a><span>微信 ' + escapeHTML(data.profile.wechatId) + '</span></div><div class="footer-end"><span class="tiny-label">LAST FRAME</span><a href="#top">回到顶部 ' + arrow + "</a></div>";
  }

  function socialIcon(social) {
    return '<span class="social-icon social-icon--' + escapeHTML(social.id) + '" aria-hidden="true">' + escapeHTML(social.icon) + "</span>";
  }

  function socialRows() {
    return data.socials.map((social, index) => {
      const href = safeHref(social.href);
      const rowTag = href ? "a" : "div";
      const attrs = href ? ' href="' + escapeHTML(href) + '"' + externalAttrs(href) : ' aria-disabled="true"';
      const muted = social.status !== "LIVE" ? " is-soon" : "";
      const bars = Array.from({ length: 7 }, (_, index) => '<span class="signal-bar ' + (index < (social.status === "LIVE" ? 7 : 4) ? "is-on" : "") + '"></span>').join("");
      return "<" + rowTag + ' class="signal-row' + muted + '" style="--row-index:' + index + '"' + attrs + "><span class=\"signal-platform\">" + socialIcon(social) + '<span class="sr-only">' + escapeHTML(social.name) + '</span></span><span class="signal-handle">' + escapeHTML(social.handle) + '</span><span class="signal-metric">' + escapeHTML(social.metric) + '</span><span class="signal-bars" aria-hidden="true">' + bars + '</span><span class="signal-status"><i></i>' + escapeHTML(social.status) + '</span><span class="sr-only">' + escapeHTML(social.metricLabel) + '，数据更新时间：' + escapeHTML(social.updatedAt) + "</span></" + rowTag + ">";
    }).join("");
  }

  function renderCarousel(featured) {
    const href = escapeHTML(safeHref(featured.href));
    const cover = escapeHTML(featured.cover);
    const beats = [
      { n: "01", title: "零基础", accent: "", caption: "起点 · " + featured.publishedAt + " · 人生复刻短视频", tone: "c1", alt: featured.coverAlt },
      { n: "02", title: "做成", accent: "爆款", caption: featured.metrics.join(" · "), tone: "c2", alt: "" },
      { n: "03", title: "交出去", accent: "", caption: "把方法写成可以跟着做的教程", tone: "c3", alt: "" },
    ];
    return beats.map((beat) => {
      const em = beat.accent ? "<em>" + escapeHTML(beat.accent) + "</em>" : "";
      return '<a class="carousel-card ' + beat.tone + '" data-od-id="work-card-' + beat.n + '" href="' + href + '"' + externalAttrs(href) + ">" +
        '<img class="carousel-still" src="' + cover + '" alt="' + escapeHTML(beat.alt) + '" width="1200" height="480">' +
        '<span class="carousel-scrim" aria-hidden="true"></span>' +
        '<span class="carousel-top"><span class="carousel-brand"><i></i><span>阿晔</span></span><span class="carousel-index">WORK · ' + beat.n + " / 03</span></span>" +
        '<span class="carousel-lockup"><span class="carousel-title">' + escapeHTML(beat.title) + em + "</span></span>" +
        '<span class="carousel-foot"><span class="carousel-caption">' + escapeHTML(beat.caption) + '</span><span class="carousel-stamp">X · 原文</span></span>' +
      "</a>";
    }).join("");
  }

  function renderHome() {
    const app = $("#app");
    if (!app) return;
    const profile = data.profile;
    const featured = data.featuredWork;
    const cards = renderCarousel(featured);
    app.innerHTML = '<section class="home-section hero-section aurora-hero" id="top" data-od-id="page-hero"><canvas id="aurora-veil" class="aurora-canvas" aria-hidden="true"></canvas><div class="aurora-overlay"><p class="aurora-kicker"><span class="aurora-dot"></span>01 · 个人主页</p><div class="aurora-bottom"><div class="aurora-copy"><h1 data-od-id="hero-title">阿晔<br><span>QURIOUS</span></h1><p class="aurora-role">' + escapeHTML(profile.role) + '</p><p class="aurora-sub">' + escapeHTML(profile.value) + '</p></div><p class="aurora-badge">移动光标，帷幕会跟着偏</p></div></div><a class="section-marker" href="#about" data-od-id="hero-next" aria-label="前往认识我"><span></span></a></section>' +
      '<section class="home-section about-section" id="about" data-od-id="page-about"><div class="about-grid page-width"><div class="about-stage" data-hologram-stage><div class="avatar-orbit"><div class="avatar-plane"><img class="about-avatar about-avatar--ghost" src="assets/generated/about-avatar-v3-clean.png" alt="" aria-hidden="true"><img class="about-avatar about-avatar--main" src="assets/generated/about-avatar-v3-clean.png" alt="阿晔的金发白西装 3D 风格人物"><span class="avatar-scan" aria-hidden="true"></span><span class="avatar-glitch avatar-glitch--one" aria-hidden="true"></span><span class="avatar-glitch avatar-glitch--two" aria-hidden="true"></span></div></div><div class="identity-tag"><span>阿晔 / QURIOUS</span><i></i><b></b></div></div><div class="about-copy" data-hologram-panel><div class="about-topline"><div class="about-heading"><h2>认识我</h2><span>02 · WHERE I CREATE</span></div><div class="signal-heading"><h3>全平台信号台</h3><p><b>LIVE</b> / SOON</p></div></div><div class="heading-line"><i></i></div><div class="signal-list">' + socialRows() + '</div><p class="stats-note sr-only">更新于 ' + escapeHTML(data.stats.updatedAt) + ' · ' + escapeHTML(data.stats.note) + "</p></div></div></section>" +
      '<section class="home-section work-section carousel-stage" id="work" data-od-id="page-work"><div class="page-width carousel-wrap"><div class="carousel-head" data-reveal><div><h2 data-od-id="work-title">三张卡片。一件作品。</h2><p class="carousel-piece">' + escapeHTML(featured.title) + '</p><p class="carousel-lede">03 · 代表作。同一条 X 长文拆成三拍，合起来读是：零基础，做成爆款，交出去。</p></div><p class="carousel-badge">SERIES · 01 → 03</p></div><div class="carousel-row" data-reveal>' + cards + '</div><p class="carousel-next"><a href="ai-hub.html" data-od-id="work-to-hub">下一页 · AI 小站</a></p></div></section>';
  }

  function renderAiHub() {
    const app = $("#app");
    if (!app) return;
    const list = (items) => items.map((item, index) => {
      const href = safeHref(item.href);
      const action = href ? '<a href="' + escapeHTML(href) + '"' + externalAttrs(href) + '>打开入口 ' + arrow + "</a>" : '<span class="pending-link">' + escapeHTML(item.status || "待补链接") + "</span>";
      return '<article class="hub-row"><span class="hub-index">' + String(index + 1).padStart(2, "0") + '</span><div class="hub-row-copy"><span>' + escapeHTML(item.meta) + '</span><h3>' + escapeHTML(item.title) + '</h3><p>' + escapeHTML(item.note) + '</p></div>' + action + "</article>";
    }).join("");
    app.innerHTML = '<main class="ai-page"><section class="ai-hero page-width" data-reveal><img class="ai-accent" src="assets/generated/ai-hub-paper-accent.png" alt="" aria-hidden="true"><div class="ai-hero-copy"><p class="ai-page-index" data-od-id="hub-index">04</p><h1 data-od-id="hub-title">AI 小站</h1><p class="ai-subtitle">PRACTICAL AI NOTES &amp; RESOURCES</p><p class="ai-intro">把教程、工具和可复用资源整理成一个长期更新的入口。</p></div></section><section class="ai-content page-width"><div class="tutorial-pane" id="tutorials"><div class="ai-section-title"><i></i><h2>教程区</h2><span>TUTORIALS</span></div><div class="hub-list">' + list(data.tutorials) + '</div></div><div class="resource-pane" id="resources"><div class="resource-pane-inner"><div class="ai-section-title"><i></i><h2>资源区</h2><span>RESOURCES</span></div><div class="hub-list">' + list(data.resources) + "</div></div></div></section></main>";
  }

  function initReveal() {
    const targets = $$("[data-reveal]");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    targets.forEach((target) => observer.observe(target));
  }

  function initNavObserver() {
    if (page !== "home" || !("IntersectionObserver" in window)) return;
    const sections = ["about", "work"].map((id) => document.getElementById(id)).filter(Boolean);
    const links = $$(".nav-link[data-nav-target]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("is-active", link.dataset.navTarget === entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  function initHeroParallax() {
    const section = $(".hero-section");
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    section.addEventListener("pointermove", (event) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      section.style.setProperty("--hero-x", (x * 8).toFixed(2) + "px");
      section.style.setProperty("--hero-y", (y * 5).toFixed(2) + "px");
    });
    section.addEventListener("pointerleave", () => {
      section.style.setProperty("--hero-x", "0px");
      section.style.setProperty("--hero-y", "0px");
    });
  }

  function initAboutHologram() {
    const section = $(".about-section");
    if (!section) return;
    const nav = $("#site-nav");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window)) {
      section.classList.add("is-hologram-live");
    } else {
      const observer = new IntersectionObserver(([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio > 0.16;
        section.classList.toggle("is-hologram-live", active);
        nav?.classList.toggle("is-over-about", active);
      }, { threshold: [0, 0.16, 0.35, 0.65] });
      observer.observe(section);
    }
    if (reducedMotion) return;
    section.addEventListener("pointermove", (event) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      section.style.setProperty("--holo-ry", (x * 4.5).toFixed(2) + "deg");
      section.style.setProperty("--holo-rx", (y * -2.5).toFixed(2) + "deg");
      section.style.setProperty("--holo-shift-x", (x * 10).toFixed(2) + "px");
      section.style.setProperty("--holo-shift-y", (y * 5).toFixed(2) + "px");
    });
    section.addEventListener("pointerleave", () => {
      section.style.setProperty("--holo-ry", "0deg");
      section.style.setProperty("--holo-rx", "0deg");
      section.style.setProperty("--holo-shift-x", "0px");
      section.style.setProperty("--holo-shift-y", "0px");
    });
  }

  function initContact() {
    const trigger = $(".coffee-trigger");
    const details = $("#contact-details");
    const hint = $(".contact-hint");
    if (!trigger || !details) return;
    trigger.addEventListener("click", () => {
      const open = details.hidden;
      details.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
      trigger.classList.toggle("is-open", open);
      if (open) {
        const privateValue = $("[data-private-value]", details);
        const copyWechat = $('[data-copy="wechat"]', details);
        if (privateValue) privateValue.textContent = data.profile.wechatId;
        if (copyWechat) copyWechat.disabled = false;
        if (hint) hint.textContent = "已展开。添加微信时可备注 Coffee Chat 或 AI 群。";
      } else if (hint) {
        hint.textContent = "点击 Coffee Chat，查看微信与 AI 群入口。";
      }
    });
  }

  function initCopyButtons() {
    const values = { wechat: data.profile.wechatId, email: data.profile.email, group: data.profile.wechatId + "（备注：AI 群）" };
    $$("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (button.disabled) return;
        const value = values[button.dataset.copy];
        if (!value) return;
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          const input = document.createElement("textarea");
          input.value = value;
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          input.remove();
        }
        const toast = $(".copy-toast");
        if (toast) {
          toast.textContent = button.dataset.copy === "email" ? "邮箱已复制" : "微信信息已复制";
          toast.classList.add("is-visible");
          window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
        }
      });
    });
  }

  function initLightbox() {
    const lightbox = $("#photo-lightbox");
    if (!lightbox) return;
    const photos = data.photography;
    const image = $("[data-lightbox-image]", lightbox);
    const caption = $("[data-lightbox-caption]", lightbox);
    let current = 0;
    const setPhoto = (index) => {
      current = (index + photos.length) % photos.length;
      image.src = photos[current].src;
      image.alt = photos[current].alt;
      caption.textContent = (current + 1) + " / " + photos.length;
    };
    const close = () => {
      lightbox.hidden = true;
      document.body.classList.remove("is-lightbox-open");
    };
    $$("[data-photo-index]").forEach((button) => button.addEventListener("click", () => {
      setPhoto(Number(button.dataset.photoIndex));
      lightbox.hidden = false;
      document.body.classList.add("is-lightbox-open");
    }));
    $("[data-lightbox-close]", lightbox)?.addEventListener("click", close);
    $("[data-lightbox-prev]", lightbox)?.addEventListener("click", () => setPhoto(current - 1));
    $("[data-lightbox-next]", lightbox)?.addEventListener("click", () => setPhoto(current + 1));
    lightbox.addEventListener("click", (event) => { if (event.target === lightbox) close(); });
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") setPhoto(current - 1);
      if (event.key === "ArrowRight") setPhoto(current + 1);
    });
  }

  function initHashScroll() {
    if (page !== "home" || !window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    window.setTimeout(() => {
      window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
      if (target.classList.contains("about-section")) {
        target.classList.add("is-hologram-live");
        $("#site-nav")?.classList.add("is-over-about");
      }
    }, 80);
  }

  function initAurora() {
    const canvas = document.getElementById("aurora-veil");
    const section = $(".aurora-hero");
    if (!canvas || !section) return;
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: false });
    if (!gl) {
      section.classList.add("aurora-fallback");
      return;
    }
    const VERT = "#version 300 es\nvoid main(){ vec2 p=vec2((gl_VertexID<<1)&2, gl_VertexID&2); gl_Position=vec4(p*2.0-1.0,0.0,1.0); }";
    const FRAG = "#version 300 es\nprecision highp float;\nout vec4 o;\nuniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;\nfloat hash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453); }\nfloat noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);\n  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }\nfloat fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*1.9+3.0; a*=0.55; } return v; }\nvec3 auroraPal(float t){\n  return mix(mix(vec3(0.10,0.9,0.45), vec3(0.15,0.8,0.85), smoothstep(0.0,0.5,t)),\n             vec3(0.6,0.35,0.95), smoothstep(0.5,1.0,t));\n}\nvoid main(){\n  vec2 uv=gl_FragCoord.xy/u_res;\n  vec2 p=(gl_FragCoord.xy-0.5*u_res)/u_res.y;\n  float sway=(u_mouse.x-0.5)*1.2;\n  vec3 col=mix(vec3(0.02,0.03,0.09), vec3(0.03,0.06,0.16), uv.y);\n  vec2 sc=floor(gl_FragCoord.xy/3.0);\n  float star=step(0.9975, hash(sc))*pow(hash(sc+7.0),2.0)*smoothstep(0.3,1.0,uv.y);\n  col+=vec3(0.9,0.95,1.0)*star;\n  float t=u_time*0.15;\n  for(int i=0;i<3;i++){\n    float fi=float(i);\n    float base=(fi-1.0)*0.55 + sway*(0.35+fi*0.2);\n    float cx=base + sin(p.y*1.6 + t*2.0 + fi*2.1)*0.22 + (fbm(vec2(p.y*1.2+fi*3.0, t*1.5))-0.5)*0.7;\n    float w=0.15 + 0.09*fbm(vec2(p.y*3.0+fi, t));\n    float band=exp(-pow((p.x-cx)/w, 2.0));\n    float vert=smoothstep(-0.95,0.8,p.y) * (0.45+0.55*fbm(vec2(p.x*5.0+fi*4.0, p.y*2.6 - t*2.5)));\n    float ribbon=band*vert;\n    float hue=fract(0.12 + fi*0.28 + p.y*0.16 + t*0.3);\n    col += auroraPal(hue) * ribbon * (1.0 - fi*0.14);\n  }\n  col *= 0.7+0.5*smoothstep(1.5,0.1,length(p*vec2(0.6,1.0)));\n  col=col/(col+0.8);\n  col+=(hash(gl_FragCoord.xy+u_time)-0.5)*0.02;\n  o=vec4(pow(max(col,0.0),vec3(0.9)),1.0);\n}";
    function sh(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        section.classList.add("aurora-fallback");
        return null;
      }
      return shader;
    }
    const program = gl.createProgram();
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      section.classList.add("aurora-fallback");
      return;
    }
    gl.useProgram(program);
    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    let mouse = [0.5, 0.45];
    let target = [0.5, 0.45];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.addEventListener("pointermove", (event) => {
      const rect = section.getBoundingClientRect();
      target = [
        (event.clientX - rect.left) / Math.max(rect.width, 1),
        1 - (event.clientY - rect.top) / Math.max(rect.height, 1),
      ];
    });
    const started = performance.now();
    function resize() {
      const rect = section.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, (rect.width * d) | 0);
      const h = Math.max(1, (rect.height * d) | 0);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    function frame(now) {
      resize();
      mouse[0] += (target[0] - mouse[0]) * 0.05;
      mouse[1] += (target[1] - mouse[1]) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 0 : (now - started) / 1000);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) requestAnimationFrame(frame);
    }
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  function initAuroraNav() {
    const nav = $("#site-nav");
    const hero = $(".aurora-hero");
    if (!nav || !hero || page !== "home") return;
    const sync = () => {
      const rect = hero.getBoundingClientRect();
      const over = rect.bottom > 72 && rect.top < 80;
      nav.classList.toggle("is-over-aurora", over);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
  }

  renderNav();
  if (page === "ai-hub") renderAiHub();
  else renderHome();
  renderFooter();
  initReveal();
  initNavObserver();
  initAurora();
  initAuroraNav();
  initHeroParallax();
  initAboutHologram();
  initContact();
  initCopyButtons();
  initLightbox();
  initHashScroll();
})();
