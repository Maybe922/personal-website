import type { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type Props = {
  content: string;
};

/** 标题文字包一层 inline span，荧光笔逐行贴着文字画（折行也好看） */
const components = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1>
      <span className="heading-mark">{children}</span>
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2>
      <span className="heading-mark">{children}</span>
    </h2>
  ),
};

/** 博客正文：Markdown 渲染，排版样式见 globals.css 的 .post-body */
export function MarkdownBody({ content }: Props) {
  return (
    <div className="post-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
}
