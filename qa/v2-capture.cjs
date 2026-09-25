const { chromium } = require("C:/Users/34966/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

async function shot(page, url, out, full = false) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: out, fullPage: full });
  console.log("saved", out);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 940 } });
  page.on("pageerror", (e) => console.error("PAGE_ERROR", e.message));
  page.on("console", (m) => { if (m.type() === "error") console.error("CONSOLE_ERR", m.text()); });

  const base = "http://localhost:8137/v2/";
  await shot(page, base + "index.html", "qa/v2-pick.png");
  await shot(page, base + "dark.html", "qa/v2-dark-hero.png");
  // 滚动到各区块截图（dark）
  await page.evaluate(() => scrollTo({ top: document.querySelector("#about").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "qa/v2-dark-about.png" });
  await page.evaluate(() => scrollTo({ top: document.querySelector("#work").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "qa/v2-dark-work.png" });

  await shot(page, base + "editorial.html", "qa/v2-editorial-hero.png");
  await page.evaluate(() => scrollTo({ top: document.querySelector("#about").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "qa/v2-editorial-about.png" });

  await shot(page, base + "avant.html", "qa/v2-avant-hero.png");
  await page.evaluate(() => scrollTo({ top: document.querySelector("#about").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "qa/v2-avant-about.png" });

  // 移动端抽查
  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, base + "dark.html", "qa/v2-dark-mobile.png");
  await shot(page, base + "editorial.html", "qa/v2-editorial-mobile.png");
  await shot(page, base + "avant.html", "qa/v2-avant-mobile.png");

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
