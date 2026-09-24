import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 px-6 md:px-10 py-16 border-t border-line">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* 站点 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink3 mb-3">
              SITE
            </p>
            <p className="font-display font-700 text-xl text-ink">
              顾九<span className="text-accent">.</span>
            </p>
            <p className="mt-2 font-serif text-sm text-ink2">
              {profile.tagline}
            </p>
            <p className="mt-3 font-mono text-xs text-ink3">
              微信 <span className="text-accent">{profile.wechatId}</span> · 备注「ai」进群
            </p>
          </div>

          {/* 导航 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink3 mb-3">
              INDEX
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-sans text-sm text-ink2 hover:text-accent transition-colors">
                  → 关于我
                </Link>
              </li>
              <li>
                <Link to="/resources" className="font-sans text-sm text-ink2 hover:text-accent transition-colors">
                  → 资源下载
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="font-sans text-sm text-ink2 hover:text-accent transition-colors">
                  → 教程合集
                </Link>
              </li>
            </ul>
          </div>

          {/* 版权 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink3 mb-3">
              COLOPHON
            </p>
            <p className="font-serif text-sm text-ink2 leading-relaxed">
              © {year} 小顾九. All rights reserved.
            </p>
            <p className="mt-2 font-mono text-[11px] text-ink3">
              Built with React · Vite · TailwindCSS
            </p>
          </div>
        </div>

        {/* 底部行 */}
        <div className="mt-16 pt-8 border-t border-line flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink3">
            END OF PAGE
          </span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 font-sans text-xs text-ink2 hover:text-accent transition-colors"
          >
            <span className="border-b border-ink2/30 group-hover:border-accent pb-0.5 transition-colors">
              回到顶部
            </span>
            <ArrowUp size={12} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
