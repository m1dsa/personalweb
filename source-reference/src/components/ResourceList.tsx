import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { resources } from "@/data/resources";
import ResourceItem from "./ResourceItem";
import Reveal from "./Reveal";

/** 资源下载页内容 */
export default function ResourceList() {
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {resources.map((resource, i) => (
          <Reveal key={resource.id} delay={i * 90}>
            <ResourceItem resource={resource} />
          </Reveal>
        ))}
      </ul>

      {/* 底部提示 */}
      <Reveal className="mt-10">
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <p className="flex-1 font-serif text-sm md:text-base text-ink2 leading-relaxed">
            <span className="text-accent">小提示：</span>
            下好了不会装？每一步我都写成了图文教程，跟着点就行。
          </p>
          <Link
            to="/tutorials"
            className="group inline-flex items-center gap-2 font-sans text-sm text-ink hover:text-accent transition-colors whitespace-nowrap"
          >
            <span className="border-b border-ink/30 group-hover:border-accent pb-0.5 transition-colors">
              去教程合集
            </span>
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </Reveal>

      <p className="mt-8 font-mono text-xs text-ink3 tracking-wider">
        /* 下载即代表同意用于个人学习用途 */
      </p>
    </div>
  );
}
