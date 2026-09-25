const { chromium } = require("C:/Users/34966/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

(async () => {
  const b = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--disable-gpu"],
  });
  const ctx = await b.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
    locale: "zh-CN",
  });
  const p = await ctx.newPage();
  try {
    await p.goto("https://mp.weixin.qq.com/s/OOpfJKN3oxwf7qucKX_1Qg", { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(3500);
    const info = await p.evaluate(() => ({
      title: document.title,
      og: document.querySelector('meta[property="og:title"]')?.content || "",
      h1: document.querySelector("#activity-name")?.textContent?.trim() || "",
      account: document.querySelector("#js_name")?.textContent?.trim() || "",
    }));
    console.log(JSON.stringify(info, null, 1));
  } catch (e) {
    console.error("ERR", e.message);
  }
  await b.close();
})();
