const { chromium } = require("C:/Users/34966/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

async function capture(path, hash, width, height, waitMs = 1700, reducedMotion = "no-preference") {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--disable-gpu", "--disable-software-rasterizer", "--hide-scrollbars"],
  });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion });
  page.on("pageerror", (error) => console.error("PAGE_ERROR", error.message));
  await page.goto(`http://127.0.0.1:8123/index.html${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(waitMs);
  console.log(await page.evaluate(() => ({
    body: document.body.className,
    about: document.querySelector(".about-section")?.className,
    scrollY: window.scrollY,
  })));
  await page.screenshot({ path });
  await browser.close();
}

const [path, hash = "", width = "1672", height = "941", waitMs = "1700", reducedMotion = "no-preference"] = process.argv.slice(2);
capture(path, hash, Number(width), Number(height), Number(waitMs), reducedMotion).catch((error) => {
  console.error(error);
  process.exit(1);
});
