import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { profile } from "@/data/profile";
import Reveal from "./Reveal";

/** 置顶微信号卡片 —— 主页最醒目的位置 */
export default function WeChatCard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.wechatId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // 剪贴板不可用时静默失败
    }
  };

  return (
    <Reveal>
      <div className="relative overflow-hidden glass card-glow rounded-2xl">
        {/* 顶部高亮线 */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10 p-8 md:p-10">
          {/* 左：标签 + 说明 */}
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              WeChat · 找我本人
            </p>
            <p className="mt-4 font-serif text-base md:text-lg text-ink2 leading-relaxed">
              想进 AI 交流群、问问题、或聊聊工具玩法 —— 直接加我微信。
              <span className="text-ink">{profile.wechatNote}</span>
            </p>
          </div>

          {/* 右：大号微信号 + 复制按钮 */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-4">
            <code className="glass rounded-xl px-6 py-4 font-mono text-xl md:text-2xl text-accent tracking-wide text-center select-all">
              {profile.wechatId}
            </code>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-sans text-sm font-700 text-[#0A0A0D] transition-all duration-300 hover:bg-accent2 hover:shadow-[0_12px_40px_-12px_rgba(255,194,75,0.5)]"
            >
              {copied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={2} />}
              {copied ? "已复制" : "复制微信号"}
            </button>
          </div>
        </div>

        {/* 角落装饰 */}
        <MessageCircle
          size={120}
          strokeWidth={0.6}
          className="absolute -bottom-8 -right-6 text-white/[0.04] pointer-events-none"
        />
      </div>
    </Reveal>
  );
}
