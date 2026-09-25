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
    await p.goto("https://www.douyin.com/video/7687132237884239567", { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(5000);
    console.log("URL:", p.url());
    const links = await p.evaluate(() =>
      Array.from(document.querySelectorAll('a[href*="/user/"]')).map((a) => a.href).slice(0, 10)
    );
    console.log("USER_LINKS:", JSON.stringify(links, null, 1));
    const secuids = await p.evaluate(() => {
      const m = document.documentElement.innerHTML.match(/MS4wLjABAAAA[\w-]{20,}/g);
      return m ? [...new Set(m)].slice(0, 5) : [];
    });
    console.log("SECUIDS:", JSON.stringify(secuids));
  } catch (e) {
    console.error("ERR", e.message);
  }
  await b.close();
})();
