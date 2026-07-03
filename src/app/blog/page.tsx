import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { getAllPosts } from "@/lib/posts";
import { BlogCorners } from "@/components/blog/BlogCorners";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { siCsdn } from "simple-icons";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { InViewGroup } from "@/components/interlude/InViewGroup";
import styles from "@/components/interlude/interlude.module.css";

export const metadata: Metadata = {
  title: "博客",
  description: "记录 side project 从 0 到 1 的过程、踩过的坑，和一些碎碎念。",
};

/** 索引卡的歪斜 + 胶带颜色，按位置轮换（同项目卡语言） */
const tilt = ["-rotate-1", "rotate-[0.8deg]", "-rotate-[0.6deg]"];
const tape = ["bg-peach/45", "bg-grass/35", "bg-sky/30"];
/** 标签的迷你荧光笔色，按位置轮换 */
const tagMark = ["bg-grass/50", "bg-peach/65"];

function reveal(delaySeconds: number): CSSProperties {
  return { "--d": `${delaySeconds}s` } as CSSProperties;
}

export default function BlogIndex() {
  const sorted = getAllPosts();

  return (
    <>
      <main className="dot-grid relative z-10">
        <BlogCorners />

        {/* 页头：左标题 + 右插画（小双正在赶稿） */}
        <section className="mx-auto max-w-4xl px-5 pt-20 sm:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
            <div className="relative max-w-xl">
              {/* 扉页涂鸦：咖啡杯渍 + 回形针 + 开本日期 + 小星星 */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-[4.5rem] left-0 hidden items-center gap-6 sm:flex"
              >
                {/* 咖啡杯渍：两圈歪歪的墨线 */}
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  strokeWidth={2}
                  className="h-16 w-16 -rotate-6"
                >
                  <path
                    d="M7 35C4 18 19 6 33 7c15 1 26 10 25 26-1 17-13 25-28 24C16 56 9 49 7 35Z"
                    className="stroke-ink/15"
                  />
                  <path
                    d="M13 34c-1-12 9-20 19-19 11 1 20 7 19 19-1 12-10 18-20 17-10 0-17-6-18-17Z"
                    className="stroke-ink/10"
                  />
                </svg>
                {/* 回形针 */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 rotate-[18deg] stroke-ink/35"
                >
                  <path d="M7.5 12.8 13 7.3a3.6 3.6 0 0 1 5.1 5.1l-6.6 6.6a2.4 2.4 0 0 1-3.4-3.4l6-6" />
                </svg>
                <span className="-rotate-2 font-mono text-[11px] tracking-wide text-ink-faint">
                  est. 2026.06
                </span>
              </div>
              {/* 标题右上的小星星 */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="absolute -top-7 right-2 h-5 w-5 rotate-12 fill-peach"
              >
                <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
              </svg>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-grass-deep">
                writing · 实验日志
              </span>
              <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
                博客 &{" "}
                <mark className="inline-block -rotate-1 rounded-lg bg-peach/70 px-2.5 pb-1 pt-0.5 text-ink">
                  碎碎念
                </mark>
              </h1>
            </div>

            <div className="relative mx-auto sm:mx-0">
              <Image
                src="/blog-writing.webp"
                alt="小双趴在桌上奋笔疾书，纸页在旁边乱飞，头顶亮着一个灵感灯泡"
                width={932}
                height={1198}
                priority
                className="w-40 -rotate-2 sm:w-48"
              />
              {/* 手绘「实验日志」印章 */}
              <span
                aria-hidden
                className="absolute -right-6 bottom-1 grid size-20 rotate-12 place-items-center rounded-full border-2 border-dashed border-[#c9463d]/60 text-center font-display text-sm font-bold leading-tight text-[#c9463d]/75"
              >
                实验
                <br />
                日志
              </span>
            </div>
          </div>
        </section>

        {/* 时间轴 + 索引卡 */}
        <section className="mx-auto max-w-3xl px-5 pb-24 pt-12">
          <InViewGroup className={styles.root}>
            <ol className="relative ml-2 border-l-2 border-dashed border-ink/15 sm:ml-4">
              {sorted.map((post, index) => (
                <li
                  key={post.slug}
                  className={`${styles.line} relative pb-12 pl-7 sm:pl-10`}
                  style={reveal(index * 0.12)}
                >
                  {/* 时间轴节点 */}
                  <span
                    aria-hidden
                    className={`absolute -left-[9px] top-8 size-4 rounded-full border-2 ${
                      index === 0
                        ? "border-ink/70 bg-grass"
                        : "border-ink/40 bg-canvas"
                    }`}
                  />

                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                  >
                    <div
                      className={`relative transition-transform duration-300 ease-out ${tilt[index % tilt.length]} group-hover:rotate-0 group-hover:-translate-y-1`}
                    >
                      {/* 胶带 */}
                      <span
                        aria-hidden
                        className={`absolute -top-2.5 left-8 z-10 h-6 w-20 -rotate-3 rounded-[2px] ${tape[index % tape.length]}`}
                      />
                      {/* 最新一篇贴 NEW 贴纸 */}
                      {index === 0 ? (
                        <span
                          aria-hidden
                          className="absolute -top-3 right-6 z-10 rotate-6 rounded-md bg-peach px-2 py-0.5 font-display text-xs font-bold text-ink shadow-soft"
                        >
                          NEW!
                        </span>
                      ) : null}

                      <div className="rounded-[1.25rem] border border-hair bg-surface p-6 shadow-soft transition-shadow duration-300 group-hover:shadow-lift sm:p-7">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                          <div className="min-w-0 flex-1">
                            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-grass-deep">
                              {post.title}
                            </h2>
                            <p className="mt-2.5 text-pretty leading-relaxed text-ink-soft">
                              {post.excerpt}
                            </p>
                            <div className="mt-5 flex items-center justify-between">
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tag}
                                    className={`inline-block -rotate-1 rounded-[0.3em] px-1.5 py-0.5 text-xs font-medium text-ink ${tagMark[tagIndex % tagMark.length]}`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-grass-deep">
                                阅读
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </div>
                          </div>

                          {/* 封面：贴在卡片里的拍立得，悬停时被「抚平」一点 */}
                          {post.cover ? (
                            <span
                              className={`mx-auto w-44 shrink-0 rounded-sm bg-white p-1.5 pb-5 shadow-soft transition-transform duration-300 sm:mx-0 ${
                                index % 2 === 0
                                  ? "rotate-3 group-hover:rotate-1"
                                  : "-rotate-2 group-hover:-rotate-1"
                              }`}
                            >
                              <Image
                                src={post.cover}
                                alt={post.coverAlt ?? `${post.title} 的手绘封面`}
                                width={1200}
                                height={800}
                                className="w-full rounded-[2px] bg-white"
                              />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}

            </ol>

            {/* 站外便签：CSDN 上的老博客 */}
            <a
              href="https://blog.csdn.net/weixin_72917087?type=blog"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.line} group mt-2 block rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas`}
              style={reveal(0.3)}
            >
              <div className="relative rotate-1 transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:-translate-y-1">
                <span
                  aria-hidden
                  className="absolute -top-2.5 right-10 z-10 h-6 w-20 rotate-3 rounded-[2px] bg-sky/30"
                />
                <div className="flex items-center gap-4 rounded-[1.25rem] border border-hair bg-surface p-5 shadow-soft transition-shadow duration-300 group-hover:shadow-lift sm:p-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fc5531]/10 text-[#e04a2a]">
                    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
                      <path d={siCsdn.path} fill="currentColor" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      C++ 后端相关博客在我的 CSDN 里喔
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-xs text-ink-faint">
                      blog.csdn.net
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-grass-deep" />
                </div>
              </div>
            </a>
          </InViewGroup>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
