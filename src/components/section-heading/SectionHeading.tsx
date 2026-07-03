import type { ReactNode } from "react";

type Props = {
  /** 小写编号 / kicker，例如 "01 — projects"；不传则只显示标题 */
  kicker?: string;
  title: string;
  /** 右侧补充说明或操作 */
  aside?: ReactNode;
  id?: string;
};

export function SectionHeading({ kicker, title, aside, id }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-hair pb-5">
      <div>
        {kicker ? (
          <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-grass-deep">
            {kicker}
          </span>
        ) : null}
        <h2
          id={id}
          className={`font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl ${kicker ? "mt-2" : ""}`}
        >
          {title}
        </h2>
      </div>
      {aside ? (
        <div className="text-sm text-ink-soft">{aside}</div>
      ) : null}
    </div>
  );
}
