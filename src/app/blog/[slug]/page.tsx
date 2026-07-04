import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";
import { BlogCorners } from "@/components/blog/BlogCorners";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SiteFooter } from "@/components/footer/SiteFooter";

type PageParams = { slug: string };

export function generateStaticParams(): PageParams[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  // 中文 slug 到达时是百分号编码，先解码再找文章
  const { slug } = await params;
  const post = getPostBySlug(decodeURIComponent(slug));
  if (!post) return { title: "文章未找到" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.cover ?? "/og.png"],
    },
    twitter: { card: "summary_large_image" },
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
  const post = getPostBySlug(decodeURIComponent(slug));

  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <>
      <main className="dot-grid relative z-10">
        <BlogCorners backHref="/blog" backLabel="返回日志本" />
        {headings.length >= 2 ? <TableOfContents headings={headings} /> : null}

        <article className="mx-auto max-w-3xl px-5 pt-28 sm:pt-32">
          <header className="border-b border-dashed border-ink/20 pb-8">
            <time
              dateTime={post.date}
              className="inline-flex -rotate-2 items-center gap-1.5 rounded-full border border-dashed border-ink/35 px-3 py-1 font-mono text-[11px] tracking-wide text-ink-soft"
            >
              {stampDate(post.date)}
            </time>
            <h1 className="mt-5 break-words text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
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

        </article>

      </main>
      <SiteFooter />
    </>
  );
}
