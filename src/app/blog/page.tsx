import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { BlogCorners } from "@/components/blog/BlogCorners";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { siCsdn } from "simple-icons";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "博客",
  description: "记录 side project 从 0 到 1 的过程、踩过的坑，和一些碎碎念。",
};

/** 无封面时的占位底色，按位置轮换 */
const placeholderTint = ["bg-grass-soft", "bg-peach-soft", "bg-canvas-deep"];

/** 2026-07-04 -> 2026年7月4日 */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <main className="dot-grid relative z-10">
        <BlogCorners />

        {/* 页头：一行标题，不整花活 */}
        <section className="mx-auto max-w-5xl px-5 pt-24 sm:pt-28">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-grass-deep">
            writing · 实验日志
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            博客 &{" "}
            <mark className="inline-block -rotate-1 rounded-lg bg-peach/70 px-2 pb-0.5 pt-0.5 text-ink">
              碎碎念
            </mark>
          </h1>
        </section>

        {/* 文章卡片网格：封面 + 标题 + 日期 */}
        <section className="mx-auto max-w-5xl px-5 pb-24 pt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <article className="overflow-hidden rounded-2xl border border-hair bg-surface shadow-soft transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-lift">
                  {post.cover ? (
                    <Image
                      src={post.cover}
                      alt={post.coverAlt ?? `${post.title} 的封面`}
                      width={1200}
                      height={750}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex aspect-[16/10] w-full items-center px-7 ${placeholderTint[index % placeholderTint.length]}`}
                    >
                      <p className="line-clamp-3 text-pretty text-sm leading-relaxed text-ink-soft">
                        {post.excerpt}
                      </p>
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="line-clamp-2 break-words font-display text-lg font-semibold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-grass-deep">
                      {post.title}
                    </h2>
                    <time
                      dateTime={post.date}
                      className="mt-2.5 block text-sm text-ink-faint"
                    >
                      {formatDate(post.date)}
                    </time>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* 站外入口：CSDN 上的老博客 */}
          <a
            href="https://blog.csdn.net/weixin_72917087?type=blog"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 flex items-center gap-4 rounded-2xl border border-hair bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:p-6"
          >
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
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
