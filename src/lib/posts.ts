// 博客文章数据层：content/posts/*.md 即文章，文件名即 slug。
// 发布新文章 = 往目录里丢一个带 frontmatter 的 Markdown 文件。
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  /** ISO 日期（YYYY-MM-DD） */
  date: string;
  tags: string[];
  excerpt: string;
  /** 封面（可选，public/ 下路径，3:2 横版）；没有就渲染纯文字卡 */
  cover?: string;
  coverAlt?: string;
  /** Markdown 正文（不含 frontmatter） */
  content: string;
};

const POSTS_DIR = join(process.cwd(), "content", "posts");

function toIsoDate(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value ?? "");
}

function parsePost(filename: string): Post {
  const slug = filename.replace(/\.md$/, "");
  const raw = readFileSync(join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    date: toIsoDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    excerpt: String(data.excerpt ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    content: content.trim(),
  };
}

/** 全部文章，新的在前 */
export function getAllPosts(): Post[] {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parsePost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  // slug 来自 URL，先在白名单里核对，杜绝路径拼接风险
  return getAllPosts().find((post) => post.slug === slug);
}
