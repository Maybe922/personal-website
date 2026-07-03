import { revalidatePath } from "next/cache";

/**
 * 博客即时刷新接口：TG bot 往 content/posts/ 写完 md 后调用，
 * 让静态化的博客页在下次访问时重新读盘渲染。
 * 鉴权：请求头 x-revalidate-secret 必须等于环境变量 REVALIDATE_SECRET。
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");

  return Response.json({ ok: true, revalidated: ["/blog", "/blog/[slug]", "/"] });
}
