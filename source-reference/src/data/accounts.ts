// 账号矩阵数据

export type Account = {
  id: string;
  platform: "xiaohongshu" | "douyin" | "bilibili" | "wechat" | "channels";
  index: string;
  name: string;
  nameEn: string;
  handle: string;
  description: string;
  note?: string;        // 卡片内的小字备注
  copyText?: string;    // 一键复制的文本
  span?: "wide" | "normal"; // bento 布局：wide 占两列
  action: {
    type: "link" | "qr";
    href?: string;
    qrImage?: string;
    cta: string;
  };
};

export const accounts: Account[] = [
  {
    id: "xhs",
    platform: "xiaohongshu",
    index: "01",
    name: "小红书",
    nameEn: "Xiaohongshu",
    handle: "@小顾九",
    description: "10.5K 次赞与收藏 · AI 工具实战与案例分享",
    span: "wide",
    action: {
      type: "link",
      href: "https://xhslink.cn/m/7GJOwN7IDYh",
      cta: "前往主页",
    },
  },
  {
    id: "douyin",
    platform: "douyin",
    index: "02",
    name: "抖音",
    nameEn: "Douyin",
    handle: "@小顾九",
    description: "短视频教程 · 工具速览 · 实操演示",
    span: "normal",
    action: {
      type: "link",
      href: "https://v.douyin.com/5b5gTyJ4xYg/",
      cta: "前往主页",
    },
  },
  {
    id: "bilibili",
    platform: "bilibili",
    index: "03",
    name: "哔哩哔哩",
    nameEn: "Bilibili",
    handle: "@小顾九",
    description: "完整教程 · 长视频深度讲解",
    span: "normal",
    action: {
      type: "link",
      href: "https://b23.tv/VwHvaHz",
      cta: "前往主页",
    },
  },
  {
    id: "channels",
    platform: "channels",
    index: "04",
    name: "视频号",
    nameEn: "Channels",
    handle: "微信视频号",
    description: "AI 工具短视频 · 实操演示 · 微信内每日更新",
    span: "wide",
    action: {
      type: "qr",
      qrImage: "/assets/wechat-qr.jpg",
      cta: "扫码关注",
    },
  },
];
