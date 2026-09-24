// 资源下载数据 —— 所有安装包都放在这个页面

export type Resource = {
  id: string;
  index: string;        // 序号
  title: string;        // 资源名
  platform: "mac" | "win" | "cross" | "external";
  version?: string;     // 版本号
  size?: string;        // 文件大小
  description: string;  // 一句话简介
  downloadType: "local" | "external";
  downloadHref: string; // 本地路径或外链
};

export const resources: Resource[] = [
  {
    id: "codex-mac",
    index: "01",
    title: "Codex 安装包（ChatGPT 桌面版）",
    platform: "mac",
    version: "2026.07",
    size: "566 MB",
    description: "macOS 磁盘镜像（.dmg）· Codex 已内置在 ChatGPT 桌面端",
    downloadType: "local",
    downloadHref: "/resources/codex-mac.dmg",
  },
  {
    id: "codex-win",
    index: "02",
    title: "Codex 安装包（ChatGPT 桌面版）",
    platform: "win",
    version: "2026.07",
    size: "1.4 MB",
    description: "Windows 安装程序（.exe）· 安装后自动下载完整版本",
    downloadType: "local",
    downloadHref: "/resources/codex-win.exe",
  },
  {
    id: "ccswitch",
    index: "03",
    title: "CC Switch",
    platform: "cross",
    version: "持续更新",
    size: "—",
    description: "Claude Code / Codex 等 8 款 AI 工具的供应商切换管理器 · 官方 Releases 下载（国内加速）",
    downloadType: "external",
    downloadHref: "https://ghfast.top/https://github.com/farion1231/cc-switch/releases/latest",
  },
  {
    id: "khazix-cleanup",
    index: "04",
    title: "清理电脑垃圾 Skills（卡兹克）",
    platform: "cross",
    version: "storage-analyzer",
    size: "26 KB",
    description: "卡兹克开源的 storage-analyzer：一键扫描 C 盘 / 磁盘占用，找出占空间大户，分「可自动清理 / 需人工判断 / 谨慎清理」三档，生成交互式清理报告 —— Claude Code / Codex 通用",
    downloadType: "local",
    downloadHref: "/resources/khazix-storage-analyzer.zip",
  },
];
