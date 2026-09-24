import { useState } from "react";
import { Apple, ArrowUpRight, Layers, MonitorSmartphone, ChevronDown } from "lucide-react";
import { tutorials } from "@/data/tutorials";
import Reveal from "@/components/Reveal";
import CcSwitchGuide from "@/components/CcSwitchGuide";

/** 教程合集页：Claude Code 各平台教程卡片 + CC Switch 站内指南卡片 */
export default function TutorialsPage() {
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenGuide((prev) => (prev === id ? null : id));
  };

  return (
    <section className="px-6 md:px-10 pt-40 pb-32 md:pt-52 md:pb-40">
      <div className="mx-auto max-w-6xl">
        {/* 页头 */}
        <header className="mb-14 md:mb-20">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink3">
              <span className="text-accent">//</span> TUTORIALS
            </p>
            <h1 className="mt-6 font-sans font-900 text-ink text-4xl md:text-6xl tracking-editorial leading-tight">
              跟着做，<span className="text-gradient">就能装好</span>
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-base md:text-lg text-ink2 leading-relaxed">
              每一篇都是我自己装过、踩过坑之后写出来的保姆级教程。
              你能复制粘贴，就能装完。
            </p>
          </Reveal>
        </header>

        {/* 教程卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutorials.map((t, i) => {
            const isOpen = openGuide === t.id;
            const card = (
              <div
                className={`group flex h-full flex-col justify-between glass card-glow rounded-2xl p-8 md:p-10 transition-colors ${
                  t.internal ? "cursor-pointer hover:border-accent/40" : ""
                } ${isOpen ? "border-accent/60" : ""}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink3 tracking-widest">
                      /{t.index}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink2">
                      {t.platform === "mac" ? (
                        <Apple size={13} strokeWidth={1.5} />
                      ) : t.platform === "win" ? (
                        <MonitorSmartphone size={13} strokeWidth={1.5} />
                      ) : (
                        <Layers size={13} strokeWidth={1.5} />
                      )}
                      {t.platform === "mac" ? "macOS" : t.platform === "win" ? "Windows" : "跨平台"}
                    </span>
                  </div>
                  <h2 className="mt-10 font-display font-700 text-2xl md:text-3xl text-ink tracking-editorial leading-snug group-hover:text-accent transition-colors">
                    {t.title}
                  </h2>
                  <p className="mt-4 font-serif text-sm md:text-base text-ink2 leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-10 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink3">
                    {t.source}
                  </span>
                  <span className="inline-flex items-center gap-2 font-sans text-sm text-ink group-hover:text-accent transition-colors">
                    {t.internal ? (
                      <>
                        <span className="border-b border-ink/30 group-hover:border-accent pb-0.5 transition-colors">
                          {isOpen ? "收起指南" : "打开指南"}
                        </span>
                        <ChevronDown
                          size={14}
                          strokeWidth={1.5}
                          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </>
                    ) : (
                      <>
                        <span className="border-b border-ink/30 group-hover:border-accent pb-0.5 transition-colors">
                          打开教程
                        </span>
                        <ArrowUpRight size={14} strokeWidth={1.5} />
                      </>
                    )}
                  </span>
                </div>
              </div>
            );

            return (
              <Reveal key={t.id} delay={i * 100} className="h-full">
                {t.internal ? (
                  <button
                    type="button"
                    onClick={() => toggle(t.id)}
                    className="block w-full h-full text-left"
                    aria-expanded={isOpen}
                  >
                    {card}
                  </button>
                ) : (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col justify-between"
                  >
                    {card}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>

        {/* 展开的站内指南 */}
        {openGuide && (
          <div className="mt-6">
            <Reveal>
              <CcSwitchGuide />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
