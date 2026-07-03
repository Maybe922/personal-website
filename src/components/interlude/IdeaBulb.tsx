import type { SVGProps } from "react";

/** 手绘风格的小灯泡：黑色线稿 + 橙色光线，配合 idea 文案使用 */
export function IdeaBulb(props: SVGProps<SVGSVGElement>) {
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
      {/* 橙色光线 */}
      <g className="stroke-peach-deep">
        <path d="M24 1.5v4" />
        <path d="m10.5 6.5 2.9 2.9" />
        <path d="m37.5 6.5-2.9 2.9" />
        <path d="M3.5 19h4" />
        <path d="M40.5 19h4" />
      </g>

      {/* 玻璃泡 + 灯座 */}
      <g className="stroke-ink">
        <path d="M24 8c-7.3.2-12.7 5.4-12.5 12.3.1 4.6 2.3 7 4.2 9.3 1.3 1.6 2.2 3.1 2.5 4.9h11.6c.3-1.8 1.2-3.3 2.5-4.9 1.9-2.3 4.1-4.7 4.2-9.3C36.7 13.4 31.3 8.2 24 8Z" />
        <path d="M19.5 39.5h9" />
        <path d="M20.5 43h7" />
      </g>

      {/* 小表情 */}
      <circle cx="19.5" cy="20.5" r="1.4" className="fill-ink" stroke="none" />
      <circle cx="28.5" cy="20.5" r="1.4" className="fill-ink" stroke="none" />
      <path d="M20.5 25.5c1.7 2 5.3 2 7 0" className="stroke-ink" />
      <g className="stroke-peach" strokeWidth={1.8}>
        <path d="M15 23h2.4" />
        <path d="M30.6 23H33" />
      </g>
    </svg>
  );
}
