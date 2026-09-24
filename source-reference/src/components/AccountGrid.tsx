import { accounts } from "@/data/accounts";
import { cn } from "@/lib/utils";
import AccountCard from "./AccountCard";
import Reveal from "./Reveal";

/** 账号矩阵 —— Bento 网格布局 */
export default function AccountGrid() {
  return (
    <div>
      <Reveal>
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink3">
            <span className="text-accent">//</span> 各大平台找我
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((account, i) => (
          <Reveal
            key={account.id}
            delay={i * 90}
            className={cn(
              "h-full",
              account.span === "wide" && "md:col-span-2"
            )}
          >
            <AccountCard account={account} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
