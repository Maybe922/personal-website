"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/toc";

type Props = {
  headings: TocHeading[];
};

/** 读到哪的判定线：标题过了视口顶部下方这个距离就算「当前小节」 */
const ACTIVE_OFFSET = 130;

/** 右侧跟随目录：滚动高亮当前小节，点击平滑跳转；窄屏（<xl）隐藏 */
export function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const onScroll = () => {
      const line = window.scrollY + ACTIVE_OFFSET;
      let current = els[0].id;
      for (const el of els) {
        if (el.offsetTop <= line) current = el.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  return (
    <nav
      aria-label="文章目录"
      className="fixed right-8 top-36 hidden w-52 xl:block"
    >
      <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
        <span aria-hidden className="size-1.5 rounded-full bg-grass-deep" />
        目录
      </p>
      <ul className="mt-3 max-h-[62vh] space-y-1 overflow-y-auto border-l-2 border-dashed border-ink/15 pl-3 pr-1">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id} className={h.level === 2 ? "pl-3" : ""}>
              <a
                href={`#${h.id}`}
                className={`inline-block rounded-[0.3em] px-1 py-0.5 text-[13px] leading-snug transition-colors duration-200 ${
                  isActive
                    ? "-rotate-1 bg-grass/45 font-medium text-ink"
                    : "text-ink-faint hover:text-ink"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
