import Link from "next/link";
import { profile } from "@/lib/site-data";
import { ArrowRight } from "@/components/icons";

type Props = {
  /** 右上角胶囊的去向与文案，默认回首页；文章页传「返回日志本」 */
  backHref?: string;
  backLabel?: string;
};

/** 博客页共用的角落导航：左上字标 + 右上返回胶囊，与首页的角落语言一致 */
export function BlogCorners({ backHref = "/", backLabel = "回首页" }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <Link
          href="/"
          aria-label={`${profile.name} 首页`}
          className="group pointer-events-auto relative font-display text-2xl font-semibold tracking-tight text-ink"
        >
          {/* 悬停时扫过的荧光笔 */}
          <span
            aria-hidden
            className="absolute -inset-x-1.5 -inset-y-0.5 -rotate-2 rounded-[0.4em] bg-grass/50 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
          <span className="relative inline-block transition-transform duration-300 ease-out group-hover:-rotate-3">
            {profile.name}
            <span className="logo-dot text-grass-deep">.</span>
          </span>
        </Link>

        <Link
          href={backHref}
          className="group pointer-events-auto inline-flex items-center gap-2 rounded-full border border-hair bg-surface/80 py-2 pl-3 pr-4 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:-rotate-2 hover:border-grass hover:text-grass-deep"
        >
          <ArrowRight className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
