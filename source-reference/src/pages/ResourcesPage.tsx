import ResourceList from "@/components/ResourceList";
import Reveal from "@/components/Reveal";

/** 资源下载页：所有安装包 */
export default function ResourcesPage() {
  return (
    <section className="px-6 md:px-10 pt-40 pb-32 md:pt-52 md:pb-40">
      <div className="mx-auto max-w-6xl">
        {/* 页头 */}
        <header className="mb-14 md:mb-20">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink3">
              <span className="text-accent">//</span> DOWNLOADS
            </p>
            <h1 className="mt-6 font-sans font-900 text-ink text-4xl md:text-6xl tracking-editorial leading-tight">
              安装包，<span className="text-gradient">都在这里</span>
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-base md:text-lg text-ink2 leading-relaxed">
              Codex、CC Switch —— 我视频里用到的工具，打包好放在这了。
              点「下载」直接拿走，不用关注不用转发。
            </p>
          </Reveal>
        </header>

        <ResourceList />
      </div>
    </section>
  );
}
