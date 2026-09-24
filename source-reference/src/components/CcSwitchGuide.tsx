import { useState } from "react";
import { ArrowUpRight, Check, Copy, Terminal } from "lucide-react";
import Reveal from "./Reveal";

/* ---------- 代码块（带复制按钮） ---------- */
function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用时静默失败
    }
  };

  return (
    <div className="relative rounded-xl bg-black/50 border border-line overflow-hidden">
      {label && (
        <div className="flex items-center gap-2 border-b border-line px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink3">
          <Terminal size={11} strokeWidth={1.5} />
          {label}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3.5 pr-14 font-mono text-[12.5px] leading-relaxed text-accent">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label="复制命令"
        className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink2 hover:text-accent hover:border-accent/40 transition-colors"
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        {copied ? "已复制" : "复制"}
      </button>
    </div>
  );
}

/* ---------- 数据（复刻自官方中文 README） ---------- */
const REQUIREMENTS = [
  { platform: "Windows", req: "Windows 10 及以上" },
  { platform: "macOS", req: "macOS 12 (Monterey) 及以上" },
  { platform: "Linux", req: "Ubuntu 22.04+ / Debian 11+ / Fedora 34+ 等主流发行版" },
];

const INSTALLS = [
  {
    id: "win",
    title: "Windows",
    blocks: [
      {
        text: (
          <>
            从 Releases 页面下载最新版本：
            <br />
            <span className="font-mono text-xs text-accent/80">
              CC-Switch-v{"{版本号}"}-Windows.msi
            </span>{" "}
            （安装包）或{" "}
            <span className="font-mono text-xs text-accent/80">
              CC-Switch-v{"{版本号}"}-Windows-Portable.zip
            </span>{" "}
            （绿色版）
          </>
        ),
      },
    ],
  },
  {
    id: "mac",
    title: "macOS",
    blocks: [
      { text: <>方式一：Homebrew 安装（推荐）</>, code: "brew install --cask cc-switch", label: "安装" },
      { text: <>更新到最新版</>, code: "brew upgrade --cask cc-switch", label: "更新" },
      {
        text: (
          <>
            方式二：从 Releases 手动下载{" "}
            <span className="font-mono text-xs text-accent/80">.dmg</span>
            。macOS 版已通过 Apple 代码签名与公证，可直接打开。
          </>
        ),
      },
    ],
  },
  {
    id: "arch",
    title: "Arch Linux",
    blocks: [{ text: <>通过 paru 安装（推荐）</>, code: "paru -S cc-switch-bin", label: "安装" }],
  },
  {
    id: "linux",
    title: "其他 Linux",
    blocks: [
      {
        text: (
          <>
            从 Releases 页面下载对应包：
            <span className="font-mono text-xs text-accent/80"> .deb </span>
            （Debian / Ubuntu）、
            <span className="font-mono text-xs text-accent/80"> .rpm </span>
            （Fedora / RHEL / openSUSE）或
            <span className="font-mono text-xs text-accent/80"> .AppImage </span>
            （通用）。
          </>
        ),
      },
    ],
  },
];

const FEATURES = [
  "一个应用，八款工具",
  "50+ 供应商预设",
  "统一 MCP / Skills 管理",
  "系统托盘秒切",
  "云同步配置",
  "Windows / macOS / Linux",
];

const STEPS = [
  {
    n: "01",
    title: "添加供应商",
    body: "点击「添加供应商」，选择预设或创建自定义配置，复制 key 即可一键导入。",
  },
  {
    n: "02",
    title: "一键切换",
    body: "主界面选中供应商点「启用」；或直接在系统托盘菜单点供应商名称，立即生效。",
  },
  {
    n: "03",
    title: "重启生效",
    body: "重启终端或对应 CLI 工具以应用更改 —— Claude Code 例外，支持热切换无需重启。",
  },
  {
    n: "04",
    title: "恢复官方登录",
    body: "添加「官方登录」预设并切换过去，执行一遍退出 / 登录流程即可随时切回。",
  },
];

const FAQS = [
  {
    q: "CC Switch 支持哪些 AI 工具？",
    a: "共八款：Claude Code、Claude Desktop、Codex、Gemini CLI、Grok Build、OpenCode、OpenClaw 和 Hermes，每款都有专属供应商预设与配置管理。",
  },
  {
    q: "切换供应商后需要重启终端吗？",
    a: "大多数工具需要重启终端或 CLI 才能生效；例外是 Claude Code，支持供应商热切换，无需重启。",
  },
  {
    q: "我的数据存储在哪里？",
    a: "数据库在 ~/.cc-switch/cc-switch.db（SQLite），设备级设置在 ~/.cc-switch/settings.json，每次切换自动备份到 ~/.cc-switch/backups/（保留最近 10 份），卸载也不影响原工具使用。",
  },
  {
    q: "为什么总有一个激活中的供应商无法删除？",
    a: "这是「最小侵入性」设计：系统会保留一个正在使用的配置，全部删除会导致对应工具无法正常运行。不常用的工具可以在设置里关闭显示。",
  },
];

const LINKS = [
  { label: "GitHub Releases 下载", href: "https://github.com/farion1231/cc-switch/releases/latest" },
  { label: "官方网站 ccswitch.io", href: "https://ccswitch.io" },
];

/* ---------- 主组件 ---------- */
export default function CcSwitchGuide() {
  return (
    <div>
      {/* 简介 */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-start glass card-glow rounded-2xl p-8 md:p-12">
          <div>
            <p className="font-serif text-base md:text-lg text-ink2 leading-relaxed max-w-2xl">
              每个 AI 编程工具都有自己的配置格式，切换 API 供应商往往意味着手动编辑
              JSON、TOML 或 .env 文件。
              <span className="text-ink">CC Switch</span> 把这些收进一个桌面应用：
              可视化界面、一键导入与切换、内置 50+ 供应商预设、统一的 MCP / Skills
              管理，所有写入都是原子操作，配置不会损坏。
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-ink2"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="flex md:flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-sans text-sm text-ink hover:text-accent transition-colors whitespace-nowrap"
              >
                <span className="border-b border-ink/30 group-hover:border-accent pb-0.5 transition-colors">
                  {l.label}
                </span>
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 系统要求 */}
      <Reveal className="mt-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink3 mb-6">
          SYSTEM REQUIREMENTS / 系统要求
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REQUIREMENTS.map((r) => (
            <div key={r.platform} className="glass rounded-2xl p-6 md:p-8">
              <p className="font-display font-700 text-xl text-ink">{r.platform}</p>
              <p className="mt-2 font-serif text-sm text-ink2 leading-relaxed">{r.req}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 安装方式 */}
      <Reveal className="mt-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink3 mb-6">
          INSTALL / 各平台安装
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INSTALLS.map((os) => (
            <div key={os.id} className="glass rounded-2xl p-6 md:p-8 flex flex-col gap-5">
              <p className="font-display font-700 text-2xl text-ink tracking-editorial">
                {os.title}
              </p>
              {os.blocks.map((b, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <p className="font-serif text-sm text-ink2 leading-relaxed">{b.text}</p>
                  {b.code && <CodeBlock code={b.code} label={b.label} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Reveal>

      {/* 快速开始 */}
      <Reveal className="mt-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink3 mb-6">
          QUICK START / 快速开始
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6 md:p-8">
              <span className="font-mono text-xs text-accent tracking-widest">/{s.n}</span>
              <p className="mt-4 font-display font-700 text-lg text-ink">{s.title}</p>
              <p className="mt-2 font-serif text-sm text-ink2 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 常见问题 */}
      <Reveal className="mt-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink3 mb-6">
          FAQ / 常见问题
        </p>
        <div className="border-t border-line">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex items-center gap-4 py-6 cursor-pointer list-none select-none px-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                <span className="font-mono text-accent text-sm">Q</span>
                <span className="flex-1 font-sans font-500 text-base md:text-lg text-ink">
                  {f.q}
                </span>
                <span className="font-mono text-ink3 text-lg transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-6 pl-9 pr-6 font-serif text-sm md:text-base text-ink2 leading-relaxed max-w-3xl">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>

      {/* 说明 */}
      <p className="mt-10 font-mono text-xs text-ink3 tracking-wider">
        /* 内容复刻自官方中文 README · 项目以 MIT 协议开源 · 完整文档见 GitHub */
      </p>
    </div>
  );
}
