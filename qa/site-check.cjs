const { chromium } = require("C:/Users/34966/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const baseUrl = "http://127.0.0.1:8123/index.html";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspectPage(browser, options) {
  const errors = [];
  const page = await browser.newPage(options);
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator(".hero-person").waitFor({ state: "visible" });

  const initial = await page.evaluate(() => {
    const avatar = document.querySelector(".avatar-orbit");
    const style = getComputedStyle(avatar);
    return {
      rows: document.querySelectorAll(".signal-row").length,
      opacity: Number(style.opacity),
      transform: style.transform,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      heroVisible: document.querySelector(".hero-person")?.getBoundingClientRect().top < window.innerHeight,
    };
  });

  assert(initial.rows === 5, "第二屏应显示五个平台");
  assert(!initial.horizontalOverflow, "页面存在横向溢出");
  assert(initial.heroVisible, "首屏主体没有进入首屏有效载荷");

  if (options.reducedMotion === "reduce") {
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    const reduced = await page.evaluate(() => ({
      opacity: Number(getComputedStyle(document.querySelector(".avatar-orbit")).opacity),
      clipPath: getComputedStyle(document.querySelector(".about-avatar--main")).clipPath,
      navHidden: document.querySelector("#site-nav").classList.contains("is-over-about"),
    }));
    assert(reduced.opacity > 0.99, "减少动画模式下人物应直接显示");
    assert(reduced.navHidden, "减少动画模式下第二屏没有隐藏浅色导航");
    await page.close();
    return { initial, reduced, errors };
  }

  assert(initial.opacity < 0.2, "第二屏人物进入视口前应保持待机状态");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1100);

  const active = await page.evaluate(() => {
    const section = document.querySelector(".about-section");
    const avatar = document.querySelector(".avatar-orbit");
    const style = getComputedStyle(avatar);
    return {
      live: section.classList.contains("is-hologram-live"),
      opacity: Number(style.opacity),
      transform: style.transform,
      navHidden: document.querySelector("#site-nav").classList.contains("is-over-about"),
    };
  });

  assert(active.live, "第二屏进入视口后没有启动渐显");
  assert(active.opacity > 0.95, "第二屏人物渐显未完成");
  assert(active.transform !== initial.transform, "第二屏没有发生空间转场");
  assert(active.navHidden, "第二屏沉浸模式没有隐藏浅色导航");

  await page.mouse.move(Math.round(options.viewport.width * 0.2), Math.round(options.viewport.height * 0.5));
  const tilt = await page.evaluate(() => getComputedStyle(document.querySelector(".about-section")).getPropertyValue("--holo-ry").trim());
  assert(tilt && tilt !== "0deg", "第二屏指针转动反馈未生效");

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.locator(".coffee-trigger").click();
  const contact = await page.evaluate(() => ({
    expanded: document.querySelector(".coffee-trigger").getAttribute("aria-expanded"),
    hidden: document.querySelector("#contact-details").hidden,
    wechat: document.querySelector("[data-private-value]").textContent.trim(),
  }));
  assert(contact.expanded === "true" && !contact.hidden, "Coffee Chat 展开交互失效");
  assert(contact.wechat === "_policeuncle", "微信号没有正确显示");
  assert(errors.length === 0, `页面脚本错误：${errors.join("；")}`);

  await page.close();
  return { initial, active, tilt, contact, errors };
}

(async () => {
  const browser = await chromium.launch({
    executablePath: chrome,
    headless: true,
    args: ["--disable-gpu", "--disable-software-rasterizer", "--hide-scrollbars"],
  });

  try {
    const desktop = await inspectPage(browser, { viewport: { width: 1672, height: 941 }, reducedMotion: "no-preference" });
    const mobile = await inspectPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
    const reducedMotion = await inspectPage(browser, { viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
    console.log(JSON.stringify({ ok: true, desktop, mobile, reducedMotion }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
