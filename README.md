# 阿晔 / QURIOUS 个人网站

直接打开 `index.html` 即可预览主站。主站现在是三屏：Aurora Veil 首页、认识我、代表作轮播。第四页是独立的 AI 小站 `ai-hub.html`。工作之外、产品与合作两屏已从主站移除。

后续填写资料时，优先修改 `content.js`：姓名、定位、账号、资源和教程都集中在这里。页面结构与交互位于 `site.js`，视觉样式位于 `site.css`。

为兼容旧链接，以下入口会自动跳转到新页面的对应区块：

- `about.html`、`media.html` → `index.html#about`
- `work.html` → `index.html#work`
- `life.html` → `index.html#life`
- `tutorials.html` → `ai-hub.html#tutorials`
- `resources.html` → `ai-hub.html#resources`

旧站源码保存在 `source-reference/`，未做修改。
