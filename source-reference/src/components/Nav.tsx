import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "关于我", en: "ABOUT" },
  { to: "/resources", label: "资源下载", en: "DOWNLOADS" },
  { to: "/tutorials", label: "教程合集", en: "TUTORIALS" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // 滚动：顶栏背景 + 阅读进度
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 切换页面时关闭手机菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // 手机菜单打开时：锁定背景滚动 + ESC 关闭
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "bg-base/80 backdrop-blur-xl border-b border-line"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
          <Link
            to="/"
            className="font-display text-lg font-700 tracking-editorial text-ink hover:text-accent transition-colors"
          >
            顾九<span className="text-accent">.</span>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-full font-sans text-sm tracking-editorial transition-all duration-300",
                    isActive
                      ? "bg-white/10 text-ink"
                      : "text-ink2 hover:text-ink hover:bg-white/5"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* 手机端：菜单按钮 */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="打开菜单"
            className="md:hidden text-ink hover:text-accent transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* 阅读进度条 */}
        <div
          className="read-progress absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-accent to-accent2"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </header>

      {/* 手机端全屏菜单 */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-base/95 backdrop-blur-xl flex flex-col animate-fade-in md:hidden">
          <div className="flex h-16 items-center justify-between px-6 border-b border-line">
            <span className="font-display text-lg font-700 tracking-editorial text-ink">
              顾九<span className="text-accent">.</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="关闭菜单"
              className="text-ink hover:text-accent transition-colors"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group flex items-baseline gap-4 py-5 border-b border-line animate-fade-up",
                    isActive ? "text-accent" : "text-ink"
                  )
                }
              >
                <span className="font-mono text-xs text-ink3 tracking-widest">
                  /{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display font-700 text-3xl tracking-editorial group-hover:text-accent transition-colors">
                  {item.label}
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-ink3">
                  {item.en}
                </span>
              </NavLink>
            ))}
          </nav>
          <p className="px-8 pb-10 font-mono text-[10px] uppercase tracking-[0.3em] text-ink3">
            XIAO GUJIU · AI TOOLS HUB
          </p>
        </div>
      )}
    </>
  );
}
