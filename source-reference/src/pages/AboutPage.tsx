import Hero from "@/components/Hero";
import WeChatCard from "@/components/WeChatCard";
import AccountGrid from "@/components/AccountGrid";

/** 主页：关于我 —— 简介 + 微信号置顶 + 各大平台账号 */
export default function AboutPage() {
  return (
    <>
      <Hero />
      <section className="px-6 md:px-10 pb-32 md:pb-40">
        <div className="mx-auto max-w-6xl flex flex-col gap-16 md:gap-20">
          {/* 微信号：最醒目位置 */}
          <WeChatCard />
          {/* 平台账号矩阵 */}
          <AccountGrid />
        </div>
      </section>
    </>
  );
}
