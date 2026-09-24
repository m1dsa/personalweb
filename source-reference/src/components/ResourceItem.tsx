import type { Resource } from "@/data/resources";
import { Download, ExternalLink, Apple, MonitorSmartphone, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  resource: Resource;
};

function PlatformIcon({ platform }: { platform: Resource["platform"] }) {
  if (platform === "mac") return <Apple size={14} strokeWidth={1.5} />;
  if (platform === "win") return <MonitorSmartphone size={14} strokeWidth={1.5} />;
  if (platform === "cross") return <Layers size={14} strokeWidth={1.5} />;
  return <ExternalLink size={14} strokeWidth={1.5} />;
}

function PlatformTag({ platform }: { platform: Resource["platform"] }) {
  const label =
    platform === "mac" ? "macOS"
      : platform === "win" ? "Windows"
        : platform === "cross" ? "跨平台"
          : "外链";
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink2">
      <PlatformIcon platform={platform} />
      {label}
    </span>
  );
}

export default function ResourceItem({ resource }: Props) {
  const isLocal = resource.downloadType === "local";
  const isExternal = !isLocal && !resource.downloadHref.startsWith("{{");
  const href = isLocal || isExternal ? resource.downloadHref : undefined;

  return (
    <li className="group relative glass card-glow rounded-2xl grid grid-cols-[1fr_auto] items-center gap-6 md:gap-10 p-6 md:p-8">
      {/* 内容 */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-xs text-ink3 tracking-widest">
            /{resource.index}
          </span>
          <h3 className="font-display font-700 text-xl md:text-2xl text-ink tracking-editorial">
            {resource.title}
          </h3>
          <PlatformTag platform={resource.platform} />
        </div>
        <p className="mt-3 font-serif text-sm text-ink2 leading-relaxed max-w-xl">
          {resource.description}
        </p>
        {(resource.version || resource.size) && (
          <div className="mt-4 flex items-center gap-4 font-mono text-[11px] text-ink3">
            {resource.version && resource.version !== "—" && (
              <span>VER {resource.version}</span>
            )}
            {resource.size && resource.size !== "—" && (
              <span>SIZE {resource.size}</span>
            )}
          </div>
        )}
      </div>

      {/* 下载按钮 */}
      <div className="flex-shrink-0">
        {href ? (
          <a
            href={href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...(isLocal ? { download: "" } : {})}
            aria-label={`下载 ${resource.title}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-sans text-sm tracking-editorial transition-all duration-300",
              isLocal
                ? "bg-accent text-[#0A0A0D] font-700 hover:bg-accent2 hover:shadow-[0_12px_40px_-12px_rgba(255,194,75,0.5)]"
                : "border border-ink/40 text-ink hover:border-accent hover:text-accent"
            )}
          >
            {isLocal ? (
              <>
                <Download size={15} strokeWidth={2} />
                <span className="hidden sm:inline">下载</span>
              </>
            ) : (
              <>
                <ExternalLink size={14} strokeWidth={1.5} />
                <span className="hidden sm:inline">查看</span>
              </>
            )}
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 px-5 py-3 font-sans text-sm text-ink3 border border-dashed border-ink3/40 rounded-xl">
            <span className="font-mono text-[10px] uppercase tracking-widest">
              待补充
            </span>
          </span>
        )}
      </div>
    </li>
  );
}
