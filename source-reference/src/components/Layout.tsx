import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

/** 全局布局：极光背景 + 噪点 + 导航 + 页面内容 + 页脚 */
export default function Layout() {
  const location = useLocation();

  // 切换页面时回到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-base text-ink">
      {/* 极光背景 */}
      <div className="aurora" aria-hidden="true">
        <div
          className="aurora-blob animate-drift-1"
          style={{
            width: "46vw",
            height: "46vw",
            top: "-14vw",
            left: "-10vw",
            background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob animate-drift-2"
          style={{
            width: "40vw",
            height: "40vw",
            top: "22vh",
            right: "-14vw",
            background: "radial-gradient(circle, rgba(13,148,136,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob animate-drift-3"
          style={{
            width: "34vw",
            height: "34vw",
            bottom: "-12vw",
            left: "30vw",
            background: "radial-gradient(circle, rgba(255,194,75,0.14) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* 噪点颗粒 */}
      <div className="grain" aria-hidden="true" />

      <Nav />
      <main key={location.pathname} className="page-enter relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
