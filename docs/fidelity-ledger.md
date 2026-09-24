# 页面复刻与 QA 记录

> 活动参考基线：`references/locked/v2/`。检查日期：2026-08-25。实现使用自有 HTML、CSS、JavaScript 与原创/用户素材；没有复制 David 项目的源码、模型或材质。

## 01 首屏

- 参考图：`references/locked/v2/01-hero.png`
- 最新证据：`qa/desktop/01-hero-v4.png`、`qa/ultrawide/01-hero-v4.png`、`qa/mobile/01-hero-v4.png`
- 保留锚点：暖米白纸感、35.8% / 64.2% 分栏、超大“阿晔 / QURIOUS”、珊瑚身份句、真人白西装视觉、右侧粒子消散、导航与纵向中线。
- 对照结果：1672×941 下中线位置、标题起点、人物头部高度和文字节奏均贴近锁图；移动端改为文字后接人物，首屏内可看到人物主体；无横向溢出。
- 允许偏差：珊瑚粒子使用独立半调素材叠加，颗粒形状比参考图更规整，但不改变主体、色块、层级和阅读路径。

<!-- identity-section:hero status=pass -->

## 02 认识我 / 全平台信号台

- 参考图：`references/locked/v2/02-about-social.png`
- 最新证据：`qa/desktop/02-about-v4.png`、`qa/ultrawide/02-about-v4.png`、`qa/mobile/02-about-v4.png`
- 保留锚点：深蓝全息空间、左侧金发白西装黑西裤小人、发光底座、身份标签、右侧标题和五行信号台。
- 数据边界：顺序为 X → 小红书 → 抖音 → 哔哩哔哩 → 视频号；X 为 672，哔哩哔哩为 1,128，其余保持 `— / SOON`，视频号保持“待补主页”。
- 动效证据：进入视口前人物透明度为 0 且处于 -68° 空间转入状态；进入后透明度为 1、转回正面并完成扫描渐显；指针移动会产生轻微立体跟随。减少动画模式直接显示最终状态。
- 允许偏差：当前是原创 3D 风格人物视觉层配合代码空间转场，不是可 360° 自由拖拽的模型；已满足本次“屏幕转动渐显”的确认范围。

<!-- identity-section:about-social status=pass -->

## 03 代表作 / AI 小站入口

- 参考图：`references/locked/v2/03-featured-ai-hub.png`
- 证据：`qa/section-work-v2.png`、`qa/work-ultrawide-qa.png`、`qa/work-mobile-final2.png`
- 结果：双焦点布局、原作品封面、正式标题、公开数据和 AI 小站独立入口保持不变。

<!-- identity-section:featured-work status=pass -->

## 04 工作之外的我

- 参考图：`references/locked/v2/04-outside-work.png`
- 证据：`qa/section-life-v2.png`、`qa/life-ultrawide-qa.png`、`qa/life-mobile-qa.png`
- 结果：一主两副摄影构图和大图浏览保持不变；未添加未经确认的标题、地点或年份。

<!-- identity-section:outside-work status=pass -->

## 05 产品与合作 / Coffee Chat

- 参考图：`references/locked/v2/05-coffee-chat.png`
- 证据：`qa/contact-open-final2.png`、`qa/contact-ultrawide-qa.png`、`qa/contact-mobile-final2.png`
- 结果：当前仍按原确认保留；点击后正确显示微信 `_policeuncle`、公开邮箱和 AI 群信息。用户计划后续删除，本次不提前移除。

<!-- identity-section:contact status=pass -->

## 06 AI 小站

- 参考图：`references/locked/v2/06-ai-hub.png`
- 证据：`qa/ai-hub-desktop-qa.png`、`qa/ai-hub-ultrawide-qa.png`、`qa/ai-hub-mobile-qa.png`
- 结果：教程区、资源区与飞书外链结构保持不变，待补条目不伪装成可用链接。

<!-- identity-section:ai-hub status=pass -->

## 最终结论

- 状态：`pass`。
- 浏览器检查通过：桌面端、超宽屏、移动端、减少动画模式、五个平台数量、滚动渐显、空间转动、Coffee Chat 展开、微信显示、无横向溢出、无页面脚本错误。
