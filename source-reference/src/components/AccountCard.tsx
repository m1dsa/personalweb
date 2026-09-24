import type { Account } from "@/data/accounts";
import { ArrowUpRight, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  account: Account;
};

export default function AccountCard({ account }: Props) {
  const [qrOpen, setQrOpen] = useState(false);
  const isLink = account.action.type === "link";
  const href = isLink && !account.action.href?.startsWith("{{") ? account.action.href : undefined;

  // 弹窗打开时：ESC 关闭 + 锁定背景滚动
  useEffect(() => {
    if (!qrOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQrOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [qrOpen]);

  const platformLabel =
    account.platform === "xiaohongshu"
      ? "XIAOHONGSHU"
      : account.platform === "douyin"
        ? "DOUYIN"
        : account.platform === "bilibili"
          ? "BILIBILI"
          : account.platform === "channels"
            ? "CHANNELS"
            : "WECHAT";

  return (
    <article className="group relative flex h-full flex-col justify-between glass card-glow rounded-2xl p-8 md:p-10 overflow-hidden">
      {/* 顶部：序号 + 平台英文 */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs text-ink3 tracking-widest">
          /{account.index}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink3 group-hover:text-accent transition-colors">
          {platformLabel}
        </span>
      </div>

      {/* 中部：平台名 + handle */}
      <div className="mt-14 md:mt-20">
        <h3 className="font-display font-700 text-3xl md:text-4xl text-ink tracking-editorial">
          {account.name}
        </h3>
        <p className="mt-2 font-mono text-xs text-ink2">{account.handle}</p>
        <p className="mt-4 font-serif text-base text-ink2 leading-relaxed max-w-xs">
          {account.description}
        </p>
        {account.note && (
          <p className="mt-4 flex items-start gap-2 font-mono text-[11px] text-ink3 leading-relaxed max-w-xs">
            <span className="text-accent mt-px">●</span>
            <span>{account.note}</span>
          </p>
        )}
      </div>

      {/* 底部：CTA */}
      <div className="mt-10">
        {isLink ? (
          href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-ink group-hover:text-accent transition-colors"
            >
              <span className="border-b border-ink/30 group-hover:border-accent pb-0.5 transition-colors">
                {account.action.cta}
              </span>
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 font-sans text-sm text-ink3">
              <span className="border-b border-dashed border-ink3/50 pb-0.5">
                链接待补充
              </span>
            </span>
          )
        ) : (
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="inline-flex items-center gap-2 font-sans text-sm text-ink group-hover:text-accent transition-colors"
          >
            <span className="border-b border-ink/30 group-hover:border-accent pb-0.5 transition-colors">
              {account.action.cta}
            </span>
            <QrCode size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* QR Lightbox */}
      {qrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base/85 backdrop-blur-md animate-fade-in p-6"
          onClick={() => setQrOpen(false)}
        >
          <div
            className="glass rounded-2xl p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display font-700 text-lg text-ink">
                {account.name}
              </span>
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                className="font-mono text-xs text-ink2 hover:text-accent transition-colors"
                aria-label="关闭"
              >
                [×] CLOSE
              </button>
            </div>
            <div className="aspect-square rounded-xl bg-white/5 border border-line flex items-center justify-center overflow-hidden">
              <img
                src={account.action.qrImage}
                alt={`${account.name}二维码`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <p className="mt-4 font-serif text-sm text-ink2 text-center">
              长按或截图后用{account.name.includes("微信") || account.platform === "channels" ? "微信" : "对应App"}扫一扫
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
