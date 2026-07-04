import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 运行时图片路由：bot 发布的封面存在 public/blog/，但 Next 只服务
 * build 时就存在的 public 文件——这里改为请求时读盘，新图立即可用。
 */
export const dynamic = "force-dynamic";

const ASSETS_DIR = join(process.cwd(), "public", "blog");

const MIME: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const file = decodeURIComponent(name);
  // 只放行「安全文件名.图片后缀」，杜绝路径逃逸
  if (!/^[\p{L}\p{N}._ -]+\.(webp|png|jpe?g|gif|avif)$/u.test(file)) {
    return new Response("bad name", { status: 400 });
  }

  const path = join(ASSETS_DIR, file);
  if (!existsSync(path)) return new Response("not found", { status: 404 });

  const ext = file.split(".").pop()!.toLowerCase();
  return new Response(new Uint8Array(readFileSync(path)), {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
