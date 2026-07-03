import type { SVGProps } from "react";
import styles from "@/components/interlude/interlude.module.css";

/** 手绘风格的元气机器人：睁眼欢呼 + 天线冒信号，和打瞌睡的芯片对着干 */
export function HappyBot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* 天线 + 信号波（循环漂浮） */}
      <g className="stroke-peach-deep">
        <path d="M24 12.5V9" strokeWidth={2} />
        <circle cx="24" cy="7" r="1.9" strokeWidth={2} />
        <g className={styles.zzz} strokeWidth={1.9}>
          <path d="M29.5 3.5q2.2 2.6 0 5.2" />
          <path d="M18.5 3.5q-2.2 2.6 0 5.2" />
        </g>
      </g>

      {/* 脑袋 + 侧边小耳朵 */}
      <g className="stroke-ink">
        <rect x="14" y="12.5" width="20" height="15" rx="4" />
        <path d="M14 20h-3.5" />
        <path d="M34 20h3.5" />
      </g>

      {/* 睁大的眼睛 + 咧嘴笑 */}
      <g className="fill-ink">
        <circle cx="19.8" cy="18.6" r="1.5" />
        <circle cx="28.2" cy="18.6" r="1.5" />
      </g>
      <path className="stroke-ink" d="M20.5 22.3q3.5 3 7 0" strokeWidth={2} />

      {/* 腮红 */}
      <g className="stroke-peach" strokeWidth={2}>
        <path d="M16.3 21.3h1.6" />
        <path d="M30.1 21.3h1.6" />
      </g>

      {/* 身体 + 举起来欢呼的手 + 小短腿 */}
      <g className="stroke-ink">
        <rect x="17.5" y="31" width="13" height="9.5" rx="3" />
        <path d="M17.5 33.5q-4.5-1-6-5" />
        <path d="M30.5 33.5q4.5-1 6-5" />
        <path d="M21 40.5v3" />
        <path d="M27 40.5v3" />
      </g>
    </svg>
  );
}
