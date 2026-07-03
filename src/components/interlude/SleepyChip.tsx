import type { SVGProps } from "react";
import styles from "@/components/interlude/interlude.module.css";

/** 手绘风格的打瞌睡芯片：闭眼 + zzz，呼应「不爱碰硬件」 */
export function SleepyChip(props: SVGProps<SVGSVGElement>) {
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
      {/* 芯片本体 + 引脚 */}
      <g className="stroke-ink">
        <rect x="12" y="17" width="24" height="21" rx="3.5" />
        <path d="M12 21.5H7.5" />
        <path d="M12 27.5H7.5" />
        <path d="M12 33.5H7.5" />
        <path d="M36 21.5h4.5" />
        <path d="M36 27.5h4.5" />
        <path d="M36 33.5h4.5" />
      </g>

      {/* 睡脸：闭眼 + 打呼的小嘴 */}
      <g className="stroke-ink" strokeWidth={2}>
        <path d="M18.5 26q1.7 1.9 3.4 0" />
        <path d="M26.2 26q1.7 1.9 3.4 0" />
        <circle cx="24.2" cy="31.5" r="1.3" strokeWidth={1.8} />
      </g>

      {/* zzz（循环漂浮） */}
      <g className={`${styles.zzz} stroke-ink-faint`} strokeWidth={1.9}>
        <path d="M31.5 13.5h3.6l-3.6 3.4h3.6" />
        <path d="M37.5 8h4l-4 3.6h4" />
        <path d="M43 2.5h2.8L43 5.2h2.8" strokeWidth={1.6} />
      </g>
    </svg>
  );
}
