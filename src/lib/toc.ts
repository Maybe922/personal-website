/** 文章目录：从 Markdown 里抽 h1/h2，生成与正文锚点一致的 id */

export type TocHeading = {
  id: string;
  text: string;
  /** 1 = #，2 = ## */
  level: 1 | 2;
};

/** 去掉行内 Markdown / HTML 记号，只留纯文字（和渲染后的标题文本一致） */
function cleanInline(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/** 标题文本 → 锚点 id；正文渲染与目录两边都用它，保证对得上 */
export function headingId(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}\-_.]/gu, "")
      .slice(0, 80) || "sec"
  );
}

/** 提取正文里的 h1/h2（跳过代码块），供右侧目录使用 */
export function extractHeadings(md: string): TocHeading[] {
  const out: TocHeading[] = [];
  let inFence = false;
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (t.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = t.match(/^(#{1,2})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const text = cleanInline(m[2]);
    if (!text) continue;
    out.push({ id: headingId(text), text, level: m[1].length as 1 | 2 });
  }
  return out;
}
