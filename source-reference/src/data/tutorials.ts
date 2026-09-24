// 教程合集数据

export type Tutorial = {
  id: string;
  index: string;
  title: string;
  platform: "mac" | "win" | "cross";
  source: string;      // 来源，如「飞书文档」
  description: string;
  href?: string;       // 外链（缺省表示站内指南，点击展开）
  internal?: boolean;  // true = 站内指南，点击展开下方内容
};

export const tutorials: Tutorial[] = [
  {
    id: "claudecode-mac",
    index: "01",
    title: "Claude Code 保姆级教程（Mac）",
    platform: "mac",
    source: "飞书文档",
    description: "Mac 安装 Claude Code 全流程：跟着复制粘贴，3 分钟装好，坑都替你踩过了",
    href: "https://qcnhsga8t0cl.feishu.cn/wiki/KHJiwaLqdi5vZgkEHUxcqMgpnHd",
  },
  {
    id: "claudecode-win",
    index: "02",
    title: "Claude Code 保姆级教程（Windows）",
    platform: "win",
    source: "飞书文档",
    description: "Windows 版安装全流程：从零开始，一步步把 Claude Code 跑起来",
    href: "https://qcnhsga8t0cl.feishu.cn/wiki/MkkTweQmzizQQQkgg4DcIMtknYb",
  },
  {
    id: "ccswitch",
    index: "03",
    title: "CC Switch 安装指南",
    platform: "cross",
    source: "站内指南",
    description: "八款 AI 工具供应商切换：Windows / macOS / Linux 安装、快速开始与常见问题，点开就能看",
    internal: true,
  },
];
