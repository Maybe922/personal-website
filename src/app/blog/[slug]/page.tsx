import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { BlogCorners } from "@/components/blog/BlogCorners";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { ArrowRight } from "@/components/icons";

type PageParams = { slug: string };

export function generateStaticParams(): PageParams[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "文章未找到" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

/** 邮戳样式的短日期：2026-06-28 -> 26.06.28 */
function stampDate(iso: string): string {
  return iso.slice(2).replaceAll("-", ".");
}

const tagMark = ["bg-grass/50", "bg-peach/65"];

export default async function BlogPost({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <main className="dot-grid relative z-10">
        <BlogCorners backHref="/blog" backLabel="返回日志本" />

        <article className="mx-auto max-w-3xl px-5 pt-28 sm:pt-32">
          <header className="border-b border-dashed border-ink/20 pb-8">
            <time
              dateTime={post.date}
              className="inline-flex -rotate-2 items-center gap-1.5 rounded-full border border-dashed border-ink/35 px-3 py-1 font-mono text-[11px] tracking-wide text-ink-soft"
            >
              {stampDate(post.date)}
            </time>
            <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag, tagIndex) => (
                <span
                  key={tag}
                  className={`inline-block -rotate-1 rounded-[0.3em] px-1.5 py-0.5 text-xs font-medium text-ink ${tagMark[tagIndex % tagMark.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* 封面：贴在正文前的大拍立得 */}
          {post.cover ? (
            <div className="relative mt-10">
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 -rotate-3 rounded-[2px] bg-peach/45"
              />
              <div className="-rotate-1 rounded-sm bg-white p-2 pb-8 shadow-lift">
                <Image
                  src={post.cover}
                  alt={post.coverAlt ?? `${post.title} 的手绘封面`}
                  width={1200}
                  height={800}
                  priority
                  className="w-full rounded-[2px] bg-white"
                />
              </div>
            </div>
          ) : null}

          <div className="mt-10 pb-12">
            <p className="text-pretty text-xl font-medium leading-relaxed text-ink">
              {post.excerpt}
            </p>
            <div className="mt-8">
              <MarkdownBody content={post.content} />
            </div>
          </div>

          {/* 写完收工贴纸 */}
          <div className="flex justify-center pb-12">
            <span className="inline-block rotate-3 rounded-md bg-grass/55 px-3 py-1 font-display text-sm font-bold text-ink shadow-soft">
              ✓ 写完收工
            </span>
          </div>
        </article>

        <div className="mx-auto max-w-3xl px-5 pb-24">
          <Link
            href="/blog"
            className="group block rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <div className="relative -rotate-1 transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:-translate-y-1">
              <span
                aria-hidden
                className="absolute -top-2.5 left-8 z-10 h-6 w-20 -rotate-3 rounded-[2px] bg-grass/35"
              />
              <div className="flex items-center justify-between rounded-[1.25rem] border border-hair bg-surface p-6 shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
                <span>
                  <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                    继续读
                  </span>
                  <span className="mt-1 block font-display text-lg font-semibold text-ink">
                    回到日志本
                  </span>
                </span>
                <ArrowRight className="size-5 text-grass-deep transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
