const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("C:/Users/34966/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const fileUrl = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function checkViewport(browser, name, viewport) {
  const errors = [];
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const hero = document.querySelector(".hero-person");
    const avatars = [...document.querySelectorAll(".about-avatar")];
    return hero?.complete && hero.naturalWidth > 0
      && avatars.length === 2
      && avatars.every((avatar) => avatar.complete && avatar.naturalWidth > 0);
  });

  const first = await page.evaluate(() => {
    const hero = document.querySelector(".hero-person");
    const nav = document.querySelector(".site-nav");
    const heroRect = hero.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    return {
      source: hero.getAttribute("src"),
      naturalWidth: hero.naturalWidth,
      naturalHeight: hero.naturalHeight,
      heroTop: heroRect.top,
      heroHeight: heroRect.height,
      navBottom: navRect.bottom,
      visibleHeight: Math.min(innerHeight, heroRect.bottom) - Math.max(0, heroRect.top),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      dirtyPeople: document.querySelectorAll('img[src$="hero-person-v3.png"], img[src$="about-avatar-v3.png"]').length,
      runtimeCutouts: document.querySelectorAll("[data-chroma-cutout]").length,
    };
  });

  assert(first.source.includes("hero-person-v3-clean.png"), "第一页没有使用清理后的上一版人物");
  assert(first.naturalWidth > 0 && first.naturalHeight > 0, "第一页人物图没有加载");
  assert(first.heroHeight > 300, "第一页人物显示尺寸不足");
  assert(!first.overflow, "第一页存在横向溢出");
  assert(first.dirtyPeople === 0, "前两屏仍引用带棋盘格的旧素材");
  assert(first.runtimeCutouts === 0, "页面仍在运行临时去白底逻辑");
  if (viewport.width > 760) {
    assert(first.visibleHeight > viewport.height * 0.55, "桌面端第一页人物显示区域不足");
  }

  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.resolve(__dirname, "current", `${name}-01-hero-file.png`) });
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#about").offsetTop));
  await page.waitForFunction(() => document.querySelector("#about").classList.contains("is-hologram-live"));
  await page.waitForTimeout(1200);

  const second = await page.evaluate(() => {
    const avatars = [...document.querySelectorAll(".about-avatar")];
    return {
      sources: avatars.map((avatar) => avatar.getAttribute("src")),
      loaded: avatars.every((avatar) => avatar.complete && avatar.naturalWidth > 0),
      rows: document.querySelectorAll(".signal-row").length,
      live: document.querySelector("#about").classList.contains("is-hologram-live"),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      navHidden: document.querySelector("#site-nav").classList.contains("is-over-about"),
    };
  });

  assert(second.sources.every((source) => source.includes("about-avatar-v3-clean.png")), "第二页没有使用清理后的上一版人物");
  assert(second.loaded, "第二页人物图没有加载");
  assert(second.rows === 5, "第二页信号台内容不完整");
  assert(second.live && second.navHidden, "第二页进入动画或沉浸导航失效");
  assert(!second.overflow, "第二页存在横向溢出");
  assert(errors.length === 0, `页面脚本错误：${errors.join("；")}`);

  await page.screenshot({ path: path.resolve(__dirname, "current", `${name}-02-about-file.png`) });
  await page.close();
  return { first, second, errors };
}

(async () => {
  const browser = await chromium.launch({
    executablePath: chrome,
    headless: true,
    args: ["--disable-gpu", "--disable-software-rasterizer", "--hide-scrollbars", "--allow-file-access-from-files"],
  });

  try {
    const desktop = await checkViewport(browser, "desktop", { width: 1920, height: 900 });
    const mobile = await checkViewport(browser, "mobile", { width: 390, height: 844 });
    console.log(JSON.stringify({ ok: true, fileUrl, desktop, mobile }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
