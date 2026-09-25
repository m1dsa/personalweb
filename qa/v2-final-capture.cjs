const { chromium } = require("C:/Users/34966/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 940 } });
  page.on("pageerror", (e) => console.error("PAGE_ERROR", e.message));
  page.on("console", (m) => { if (m.type() === "error") console.error("CONSOLE_ERR", m.text()); });
  page.on("requestfailed", (r) => console.error("REQ_FAIL", r.url()));
  page.on("response", (r) => { if (r.status() === 404) console.error("404", r.url()); });

  const go = async (url) => { await page.goto(url, { waitUntil: "networkidle" }); await page.waitForTimeout(1300); };
  const shotAt = async (sel, path) => {
    await page.evaluate((s) => { const el = document.querySelector(s); if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: "instant" }); }, sel);
    await page.waitForTimeout(1100);
    await page.screenshot({ path });
    console.log("saved", path);
  };

  const base = "http://localhost:8137/v2/";
  await go(base + "index.html");
  await page.screenshot({ path: "qa/v2f-hero.png" }); console.log("saved qa/v2f-hero.png");
  await shotAt("#about", "qa/v2f-about.png");
  await shotAt("#work", "qa/v2f-work.png");
  await shotAt("#frames", "qa/v2f-frames.png");
  await shotAt("#site-footer", "qa/v2f-footer.png");

  await go(base + "ai-hub.html");
  await page.screenshot({ path: "qa/v2f-hub-hero.png" }); console.log("saved qa/v2f-hub-hero.png");
  await shotAt("#resources", "qa/v2f-hub-res.png");

  await page.setViewportSize({ width: 390, height: 844 });
  await go(base + "index.html");
  await page.screenshot({ path: "qa/v2f-m-hero.png" }); console.log("saved qa/v2f-m-hero.png");
  // 移动菜单
  await page.click(".menu-btn");
  await page.waitForTimeout(800);
  await page.screenshot({ path: "qa/v2f-m-menu.png" }); console.log("saved qa/v2f-m-menu.png");
  await page.click(".menu-btn");
  await shotAt("#about", "qa/v2f-m-about.png");
  await go(base + "ai-hub.html");
  await page.screenshot({ path: "qa/v2f-m-hub.png" }); console.log("saved qa/v2f-m-hub.png");

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
