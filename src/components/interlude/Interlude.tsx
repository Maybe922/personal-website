import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { profile } from "@/lib/site-data";
import { GithubIcon, RssIcon } from "@/components/icons";
import { StackStrip } from "@/components/interlude/StackStrip";
import { InViewGroup } from "@/components/interlude/InViewGroup";
import { HappyBot } from "@/components/interlude/HappyBot";
import { IdeaBulb } from "@/components/interlude/IdeaBulb";
import { SleepyChip } from "@/components/interlude/SleepyChip";
import styles from "@/components/interlude/interlude.module.css";

/** 正文里的荧光笔标记，同 h1 的双色系统 */
const markClass = {
  grass:
    "mx-0.5 inline-block -rotate-1 rounded-[0.3em] bg-grass/50 px-1.5 text-ink",
  peach:
    "mx-0.5 inline-block -rotate-1 rounded-[0.3em] bg-peach/65 px-1.5 text-ink",
};

/** h1 关键词的大号马克笔底色 */
const headlineMark: Record<"grass" | "peach", string> = {
  grass:
    "mx-1 inline-block -rotate-1 rounded-lg bg-grass/55 px-2.5 pb-1 pt-0.5 text-ink",
  peach:
    "mx-1 inline-block -rotate-1 rounded-lg bg-peach/70 px-2.5 pb-1 pt-0.5 text-ink",
};

/** 入场动画的延迟 + 水平飘入方向 */
function reveal(delaySeconds: number, fromX?: number): CSSProperties {
  return {
    "--d": `${delaySeconds}s`,
    ...(fromX !== undefined ? { "--dx": `${fromX}px` } : {}),
  } as CSSProperties;
}

export function Interlude() {
  return (
    <section
      className="relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16"
      aria-labelledby="hero-heading"
    >
      {/* seamless colour field — fills to the very top, behind the floating nav.
          grass -> peach across the top, then masked to fade fully into the
          shared canvas base at the bottom so the whole page keeps one background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-gradient-to-br from-grass-soft/75 via-grass-soft/25 to-peach-soft/60 [mask-image:linear-gradient(to_bottom,black_40%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_92%)]"
      />
      {/* atmospheric blooms for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 -z-10 size-[32rem] rounded-full bg-grass/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 -z-10 size-[26rem] rounded-full bg-peach/25 blur-[110px]"
      />

      {/* 左上角：字标 + 存钱罐小猪（earn2play 吉祥物） */}
      <div className="reveal absolute left-5 top-5 z-10 sm:left-8 sm:top-7">
        <Link
          href="/"
          aria-label={`${profile.name} 首页`}
          className="group relative font-display text-2xl font-semibold tracking-tight text-ink"
        >
          {/* 悬停时扫过的荧光笔 */}
          <span
            aria-hidden
            className="absolute -inset-x-1.5 -inset-y-0.5 -rotate-2 rounded-[0.4em] bg-grass/50 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
          <span className="relative inline-block transition-transform duration-300 ease-out group-hover:-rotate-3">
            {profile.name}
            <span className="logo-dot text-grass-deep">.</span>
          </span>
        </Link>
        <Image
          src="/piggy-bank.webp"
          alt="绿色的存钱罐小猪，一枚硬币正掉进背上的投币口"
          width={889}
          height={976}
          className={`${styles.floatA} mt-8 hidden w-28 rotate-6 -scale-x-100 lg:block xl:w-32`}
        />
      </div>

      {/* 右上角：博客 + GitHub 入口 */}
      <div className="reveal absolute right-5 top-5 z-10 flex items-center gap-2.5 sm:right-8 sm:top-7">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-full border border-hair bg-surface/80 py-2 pl-3 pr-4 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:rotate-2 hover:border-peach-deep hover:text-peach-deep"
        >
          <RssIcon className="size-4.5" />
          博客
        </Link>
        <a
          href="https://github.com/Maybe922"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub：Maybe922（新窗口打开）"
          className="group inline-flex items-center gap-2 rounded-full border border-hair bg-surface/80 py-2 pl-3 pr-4 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:-rotate-2 hover:border-grass hover:text-grass-deep"
        >
          <GithubIcon className="size-4.5" />
          GitHub
        </a>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal mx-auto max-w-3xl pt-6 text-center sm:pt-10">
          <h1
            id="hero-heading"
            className="font-display text-4xl font-semibold leading-[1.3] tracking-tight text-ink sm:text-5xl"
          >
            {profile.headline.flat().map((segment, index) =>
              segment.tone ? (
                <span key={index} className={headlineMark[segment.tone]}>
                  {segment.text}
                </span>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
          </h1>
          <p className="mt-5 text-pretty text-lg font-medium leading-relaxed text-ink/85">
            {profile.summary}
          </p>
        </div>

        <InViewGroup
          className={`${styles.root} mt-10 grid grid-cols-1 items-center gap-x-10 gap-y-8 lg:grid-cols-[1fr_auto_1fr]`}
        >
          <div className="mx-auto max-w-[20em] -rotate-1 lg:mx-0 lg:justify-self-end lg:text-right">
            <div className="mb-5 flex justify-start pl-1 lg:pl-2">
              <span className="inline-block -rotate-6 transition-transform duration-200 ease-out hover:rotate-3">
                <SleepyChip
                  className={`${styles.logo} h-12 w-12`}
                  style={reveal(0.3)}
                />
              </span>
            </div>
            <h2
              className={`${styles.label} inline-block rounded-md bg-grass/55 px-2.5 py-0.5 text-[15px] font-semibold text-ink`}
              style={reveal(0)}
            >
              我是谁
            </h2>
            <p className="mt-3 text-[17px] leading-loose text-ink/80 lg:text-[19px]">
              <span className={`${styles.line} block`} style={reveal(0.1, -12)}>
                我是<mark className={markClass.grass}>小双</mark>，00 后
              </span>
              <span className={`${styles.line} block`} style={reveal(0.2, -12)}>
                喜欢自由，只听自己的
              </span>
              <span className={`${styles.line} block`} style={reveal(0.3, -12)}>
                <mark className={markClass.peach}>物联网</mark>
                专业出身，但不爱碰硬件
              </span>
              <span className={`${styles.line} block`} style={reveal(0.4, -12)}>
                大学四年泡在 C、C++ 和 Linux 里
              </span>
            </p>
          </div>

          {/* 底图抠掉了两个 AI logo，再用绝对定位叠回原位，让它们能单独浮动 */}
          <div className="relative mx-auto w-64 sm:w-80">
            <Image
              src="/interlude-base.webp"
              alt="小双闭着眼睛微笑，双手向两侧摊开，左手上方悬浮着 Codex 的花结标志，右手上方悬浮着橙色的 Claude 星芒标志"
              width={800}
              height={1200}
              priority
              className="w-full"
            />
            <Image
              src="/about-codex.webp"
              alt=""
              aria-hidden
              width={131}
              height={131}
              className={`${styles.floatA} absolute h-auto`}
              style={{ left: "9.5%", top: "25.33%", width: "16.38%" }}
            />
            <Image
              src="/about-claude.webp"
              alt=""
              aria-hidden
              width={131}
              height={135}
              className={`${styles.floatB} absolute h-auto`}
              style={{ left: "73.5%", top: "24.67%", width: "16.38%" }}
            />
          </div>

          <div className="mx-auto max-w-[20em] rotate-1 lg:mx-0 lg:justify-self-start">
            <div className="mb-5 flex justify-end pr-1 lg:pr-2">
              <span className="inline-block rotate-6 transition-transform duration-200 ease-out hover:-rotate-3">
                <HappyBot
                  className={`${styles.logo} h-16 w-16`}
                  style={reveal(0.75)}
                />
              </span>
            </div>
            <h2
              className={`${styles.label} inline-block rounded-md bg-peach/70 px-2.5 py-0.5 text-[15px] font-semibold text-ink`}
              style={reveal(0.35)}
            >
              我在赌什么
            </h2>
            <p className="mt-3 text-[17px] leading-loose text-ink/80 lg:text-[19px]">
              <span className={`${styles.line} block`} style={reveal(0.45, 12)}>
                我相信 AI 是普通人最好的杠杆
              </span>
              <span className={`${styles.line} block`} style={reveal(0.55, 12)}>
                <mark className={markClass.peach}>Claude + GPT</mark>{" "}
                就是我的左右手
              </span>
              <span className={`${styles.line} block`} style={reveal(0.65, 12)}>
                我会逐步实现各种疯狂的{" "}
                <mark className={markClass.grass}>idea</mark>
              </span>
            </p>
            <div className="mt-4 flex justify-end pr-1 lg:pr-4">
              <span className="inline-block rotate-6 transition-transform duration-200 ease-out hover:-rotate-3">
                <IdeaBulb className={`${styles.logo} h-12 w-12`} style={reveal(0.9)} />
              </span>
            </div>
          </div>
        </InViewGroup>

        <InViewGroup className={`${styles.root} mt-10`}>
          <StackStrip />
        </InViewGroup>
      </div>
    </section>
  );
}
