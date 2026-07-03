import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type Props = {
  content: string;
};

/** 博客正文：Markdown 渲染，排版样式见 globals.css 的 .post-body */
export function MarkdownBody({ content }: Props) {
  return (
    <div className="post-body">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </Markdown>
    </div>
  );
}
