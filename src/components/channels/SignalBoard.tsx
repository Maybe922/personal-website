import Image from "next/image";
import type { CSSProperties, SVGProps } from "react";
import {
  siBilibili,
  siTiktok,
  siWechat,
  siX,
  siXiaohongshu,
} from "simple-icons";
import { type Channel, channels } from "@/lib/site-data";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { InViewGroup } from "@/components/interlude/InViewGroup";
import { ArrowUpRight } from "@/components/icons";
import styles from "@/components/interlude/interlude.module.css";

/** 各平台 logo path + 品牌色小底盘（透明度压低，融进画布色调） */
const platformUi: Record<Channel["icon"], { path: string; chip: string }> = {
  xiaohongshu: { path: siXiaohongshu.path, chip: "bg-[#ff2442]/10 text-[#d81f39]" },
  wechat: { path: siWechat.path, chip: "bg-[#07c160]/12 text-[#079a4e]" },
  douyin: { path: siTiktok.path, chip: "bg-ink/8 text-ink" },
  x: { path: siX.path, chip: "bg-ink/8 text-ink" },
  bilibili: { path: siBilibili.path, chip: "bg-[#00a1d6]/12 text-[#0087b4]" },
};

/** 线上粉丝数来源：earn2play 的只读 API（数据经 TG bot /fans 同步进 SQLite） */
const FOLLOWERS_API =
  process.env.FOLLOWERS_API_URL ?? "https://earn2play.fun/api/followers";
const FOLLOWERS_REVALIDATE_SECONDS = 3600;
const FOLLOWERS_FETCH_TIMEOUT_MS = 5000;

/** 拉取各平台最新粉丝数；任何一步失败都返回 null，由静态数据兜底 */
async function fetchLiveFollowers(): Promise<Map<string, number> | null> {
  try {
    const res = await fetch(FOLLOWERS_API, {
      next: { revalidate: FOLLOWERS_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FOLLOWERS_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const data: { channels?: { platform: string; count: number }[] } =
      await res.json();
    if (!Array.isArray(data.channels)) return null;
    return new Map(
      data.channels
        .filter((c) => Number.isFinite(Number(c.count)))
        .map((c) => [String(c.platform), Number(c.count)]),
    );
  } catch {
    return null;
  }
}

const WAVE_ARC_COUNT = 4;

/** 粉丝数 → 点亮的电波弧数（对数刻度：百级 1 道，每上一个数量级多 1 道） */
function signalLevel(followers: number | null): number {
  if (!followers || followers <= 0) return 0;
  return Math.min(WAVE_ARC_COUNT, Math.max(1, Math.floor(Math.log10(followers)) - 1));
}

/** 粉丝数展示：1 万以下精确，往上缩写成 1.2万 */
function formatFollowers(followers: number | null): string {
  if (followers === null) return "—";
  if (followers < 10_000) return followers.toLocaleString("en-US");
  return `${(followers / 10_000).toFixed(1).replace(/\.0$/, "")}万`;
}

/** 入场动画延迟 */
function reveal(delaySeconds: number): CSSProperties {
  return { "--d": `${delaySeconds}s` } as CSSProperties;
}

/** 手绘信号塔：塔尖小圆点向两侧发射电波（循环浮动） */
function SignalTower(props: SVGProps<SVGSVGElement>) {
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
      {/* 电波 */}
      <g className={`${styles.zzz} stroke-peach-deep`} strokeWidth={1.9}>
        <path d="M14 9q-3.2 4.2 0 8.4" />
        <path d="M18.5 11q-2 2.7 0 5.4" />
        <path d="M34 9q3.2 4.2 0 8.4" />
        <path d="M29.5 11q2 2.7 0 5.4" />
      </g>
      {/* 塔尖 + 塔身 + 地面 */}
      <g className="stroke-ink">
        <circle cx="24" cy="7.5" r="2" strokeWidth={2} />
        <path d="M24 9.5v4" strokeWidth={2} />
        <path d="M17.5 41 24 13.5 30.5 41" />
        <path d="M20.6 28h6.8" strokeWidth={2} />
        <path d="m20.6 28 6 7.4" strokeWidth={1.8} />
        <path d="m27.4 28-6 7.4" strokeWidth={1.8} />
        <path d="M14 41h20" />
      </g>
    </svg>
  );
}

/** 手绘电波弧：跟信号塔同一支笔，点亮的弧数随粉丝数量级走 */
function WaveArcs({ level, dimmed }: { level: number; dimmed: boolean }) {
  const arcs = [
    "M7 14.5q1.8 1.5 0 3",
    "M10.5 12q3.4 4 0 8",
    "M14 9.5q5 6.5 0 13",
    "M17.5 7q6.6 9 0 18",
  ];
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      strokeWidth={2.1}
      strokeLinecap="round"
      aria-hidden
      className="hidden h-8 w-6 sm:block"
    >
      {arcs.map((d, i) => (
        <path
          key={d}
          d={d}
          className={
            i < level && !dimmed ? "stroke-peach-deep" : "stroke-ink/15"
          }
        />
      ))}
    </svg>
  );
}

function ChannelRow({ channel, index }: { channel: Channel; index: number }) {
  const ui = platformUi[channel.icon];
  const isSoon = channel.status === "soon";
  const isLink = channel.href !== "#" && !isSoon;

  const row = (
    <>
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl ${isSoon ? "bg-ink/6 text-ink-faint" : ui.chip}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="size-5">
          <path d={ui.path} fill="currentColor" />
        </svg>
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          {channel.label}
          {isLink ? (
            <ArrowUpRight className="size-3.5 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-grass-deep" />
          ) : null}
        </span>
        <span className="mt-0.5 block truncate font-mono text-xs text-ink-faint">
          {channel.handle}
        </span>
      </span>

      <span
        className={`w-16 shrink-0 text-right font-display text-lg font-semibold tracking-tight ${channel.followers === null || isSoon ? "text-ink-faint" : "text-ink"}`}
      >
        {isSoon ? "—" : formatFollowers(channel.followers)}
      </span>

      <WaveArcs level={signalLevel(channel.followers)} dimmed={isSoon} />

      <span className="flex w-[4.5rem] shrink-0 justify-end">
        <span
          className={`inline-flex -rotate-2 items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ${
            isSoon ? "bg-ink/8 text-ink-faint" : "bg-grass/55 text-ink"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${isSoon ? "bg-ink-faint/60" : "signal-live-dot bg-grass-deep"}`}
          />
          {isSoon ? "筹备中" : "播出中"}
        </span>
      </span>
    </>
  );

  const rowClass = `${styles.line} flex items-center gap-4 py-4 sm:gap-6 ${isSoon ? "opacity-60" : ""}`;
  const revealStyle = reveal(index * 0.08);

  if (isLink) {
    return (
      <a
        href={channel.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${channel.label}：${channel.handle}（新窗口打开）`}
        className={`${rowClass} group -mx-3 rounded-2xl px-3 transition-colors duration-200 hover:bg-grass-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass`}
        style={revealStyle}
      >
        {row}
      </a>
    );
  }
  return (
    <div className={rowClass} style={revealStyle}>
      {row}
    </div>
  );
}

export async function SignalBoard() {
  // API 可用时用线上粉丝数覆盖静态值（按 icon 即平台 key 对齐），失败保持 site-data 兜底
  const live = await fetchLiveFollowers();
  const board = live
    ? channels.map((channel) => {
        const count = live.get(channel.icon);
        return count === undefined ? channel : { ...channel, followers: count };
      })
    : channels;

  return (
    <section id="channels" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <InViewGroup className={styles.root}>
          <SectionHeading
            title="全平台信号台"
            aside={
              <span className="flex items-center gap-2.5">
                <SignalTower className="h-10 w-10 shrink-0" />
                同一场实测，全网同步发射中
              </span>
            }
          />

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            {/* 左半边：小双正在 ON AIR 直播 */}
            <div
              className={`${styles.line} mx-auto w-full max-w-sm -rotate-1 lg:max-w-none`}
              style={reveal(0.15)}
            >
              <Image
                src="/signal-onair.webp"
                alt="小双戴着大耳机坐在播音桌前，对着复古麦克风说话并挥手，桌上亮着橙色的 ON AIR 灯牌"
                width={1412}
                height={1114}
                className="h-auto w-full"
              />
            </div>

            <div>
              <div className="divide-y divide-hair">
                {board.map((channel, index) => (
                  <ChannelRow
                    key={channel.label}
                    channel={channel}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </InViewGroup>
      </div>
    </section>
  );
}
