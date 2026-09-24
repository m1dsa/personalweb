# 第四步 / 素材生成审核 V2

> 状态：用户已确认并进入第五步。活动参考基线为 `references/locked/v2/`；第二屏使用 V2，其余页面沿用已锁定版本。

## 已采用素材

| 区域 | 文件 | 结果 |
| --- | --- | --- |
| 全站纸张材质 | `assets/generated/warm-paper-grain.png` | 已采用 |
| 首屏半调粒子 | `assets/generated/hero-particle-world.png` | 已采用 |
| 第二屏全息舞台 | `assets/generated/holo-stage.png` | 已采用 |
| 首屏人物视觉层 | `assets/generated/hero-person-v3.png` | 已采用，以用户照片为身份依据 |
| 第二屏原创角色 | `assets/generated/about-avatar-v3.png` | 已采用，配合代码 3D 转场 |
| AI 小站装饰 | `assets/generated/ai-hub-paper-accent.png` | 已采用 |
| 真人母版 | `assets/source/profile-home-master.jpg` | 已采用 |
| X 代表作封面 | `assets/source/x-work-cover.jpg` | 已采用 |
| 三张摄影作品 | `assets/photo-flowers.jpg`、`assets/photo-autumn.jpg`、`assets/photo-steps.jpg` | 已采用压缩版 |

## 保留边界

- 第二屏角色不是可自由拖拽的 GLB/GLTF；网站以原创 3D 风格人物层加透视转入、扫描渐显、轻微跟随转动实现当前效果。
- 首屏使用以用户原照为身份依据的人物视觉层，浏览器在加载时去除棋盘底；最终构图保持金发、白西装、白内搭与黑西裤。
- 微信二维码与视频号主页未提供，因此不生成替代内容。
- 文案、数据、价格、导航、链接和交互全部由网页维护，不烘进图片。
- 不使用 David 项目的源码、模型或素材；只借鉴“滚动进入人物场景、分层渐显和空间转动”的交互思路，代码与素材均为本项目自有实现。
