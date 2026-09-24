import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="relative flex flex-col justify-center px-6 md:px-10 pt-40 pb-20 md:pt-52 md:pb-28 overflow-hidden">
      <div className="mx-auto max-w-6xl w-full">
        {/* 顶部 mono 行 */}
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-ink3 animate-fade-in">
          <span>
            <span className="text-accent">//</span> ABOUT ME
          </span>
          <span className="hidden md:block">AI TOOLS · TUTORIALS · COMMUNITY</span>
        </div>

        {/* 主标题区 */}
        <div className="relative mt-10">
          {/* 空心英文背景字 */}
          <span
            aria-hidden="true"
            className="text-outline absolute -top-6 md:-top-10 left-0 font-display font-900 text-[clamp(3.5rem,14vw,11rem)] leading-none tracking-tight select-none pointer-events-none whitespace-nowrap animate-fade-in"
          >
            {profile.nameEn}
          </span>

          <h1 className="relative font-sans font-900 text-ink leading-[1.05] tracking-editorial">
            <span className="block text-[clamp(2.5rem,8vw,6rem)] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              你好，我是
              <span className="text-gradient">{profile.name}</span>
            </span>
            <span
              className="block text-[clamp(1.25rem,3.2vw,2.25rem)] mt-6 font-700 text-ink2 animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              {profile.tagline}
            </span>
          </h1>
        </div>

        {/* 快捷入口 */}
        <div
          className="mt-12 flex flex-wrap items-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            to="/resources"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-700 text-[#0A0A0D] transition-all duration-300 hover:bg-accent2 hover:shadow-[0_12px_40px_-12px_rgba(255,194,75,0.5)]"
          >
            资源合集
            <ArrowRight size={15} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/tutorials"
            className="group inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-sans text-sm text-ink transition-all duration-300 hover:border-accent/40 hover:text-accent"
          >
            看保姆级教程
            <ArrowRight size={15} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
