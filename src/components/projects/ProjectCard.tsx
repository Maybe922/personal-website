import Image from "next/image";
import { Card } from "@heroui/react";
import { type Project, statusMeta } from "@/lib/site-data";
import { ArrowUpRight } from "@/components/icons";

const toneDot: Record<string, string> = {
  grass: "bg-grass",
  peach: "bg-peach-deep",
  ink: "bg-ink-faint",
  sky: "bg-sky",
};

const tonePill: Record<string, string> = {
  grass: "bg-grass-soft text-grass-deep",
  peach: "bg-peach-soft text-peach-deep",
  ink: "bg-canvas-deep text-ink-soft",
  sky: "bg-sky/20 text-ink-soft",
};

/** 拍立得随手贴的歪斜角度 + 胶带颜色，按卡片位置轮换 */
const tilt = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1"];
const tape = ["bg-peach/45", "bg-grass/35", "bg-sky/30"];

type Props = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: Props) {
  const status = statusMeta[project.status];
  const isLink = Boolean(project.href && project.href !== "#");

  const body = (
    <div
      className={`group relative h-full transition-transform duration-300 ease-out ${tilt[index % tilt.length]} hover:rotate-0 hover:-translate-y-1`}
    >
      {/* 半透明胶带，把拍立得「贴」在页面上 */}
      <div
        aria-hidden
        className={`absolute -top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-3 rounded-[2px] ${tape[index % tape.length]}`}
      />

      <Card
        variant="transparent"
        className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-hair bg-surface shadow-lift transition-shadow duration-300 group-hover:shadow-xl"
      >
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.coverAlt ?? `${project.name} 的手绘小插画`}
            width={1200}
            height={800}
            className="w-full bg-white"
          />
        ) : null}

        <div className="flex flex-1 flex-col p-6 pt-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              {project.name}
            </h3>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium ${tonePill[status.tone]}`}
            >
              <span className={`size-1.5 rounded-full ${toneDot[status.tone]}`} />
              {project.statusLabel ?? status.label}
            </span>
          </div>

          <p className="mt-2.5 flex-1 text-pretty text-sm leading-relaxed text-ink-soft">
            {project.blurb}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-hair pt-4">
            <span className="font-mono text-xs text-ink-faint">
              {project.period}
            </span>
            {isLink ? (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-grass-deep">
                去看看
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            ) : (
              <span className="font-mono text-xs text-ink-faint">敬请期待</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  if (!isLink) return body;

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      aria-label={`${project.name}（新窗口打开）`}
    >
      {body}
    </a>
  );
}
