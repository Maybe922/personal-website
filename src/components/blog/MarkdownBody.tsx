import type { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { headingId } from "@/lib/toc";

type Props = {
  content: string;
};

/** React 子节点拍平成纯文本，用来算与目录一致的锚点 id */
function toText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (typeof node === "object" && "props" in node) {
    return toText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/** 标题：带锚点 id（右侧目录跳转用）+ inline span 荧光笔逐行贴字 */
const components = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 id={headingId(toText(children))}>
      <span className="heading-mark">{children}</span>
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 id={headingId(toText(children))}>
      <span className="heading-mark">{children}</span>
    </h2>
  ),
};

/** 博客正文：Markdown 渲染，排版样式见 globals.css 的 .post-body */
export function MarkdownBody({ content }: Props) {
  return (
    <div className="post-body">
      {/* rehype-raw：渲染 Obsidian 笔记里的内联 HTML（如 <font>）。
          博客仅站主经 bot 发布，无外部输入，不需要 sanitize */}
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
}
