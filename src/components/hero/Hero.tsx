import Link from "next/link";
import Image from "next/image";
import { profile } from "@/lib/site-data";
import { ArrowRight } from "@/components/icons";

/** 高亮关键词的马克笔底色 */
const markClass: Record<"grass" | "peach", string> = {
  grass:
    "mx-1 inline-block -rotate-1 rounded-lg bg-grass/55 px-3 pb-1.5 pt-0.5 text-ink",
  peach:
    "mx-1 inline-block -rotate-1 rounded-lg bg-peach/70 px-3 pb-1.5 pt-0.5 text-ink",
};

export function Hero() {
  return (
    <section
      className="relative -mt-24 overflow-hidden pt-24"
      aria-labelledby="hero-heading"
    >
      {/* seamless colour field — fills to the very top, behind the floating nav.
          grass -> peach across the top, then masked to fade fully into the
          shared canvas base at the bottom so the whole page keeps one background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-gradient-to-br from-grass-soft/75 via-grass-soft/25 to-peach-soft/60 [mask-image:linear-gradient(to_bottom,black_40%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_92%)]"
      />
      {/* atmospheric blooms for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 -z-10 size-[32rem] rounded-full bg-grass/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-[26rem] rounded-full bg-peach/25 blur-[110px]"
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-5 pb-10 pt-6 lg:grid-cols-[1.4fr_1fr] lg:gap-6 lg:pb-20 lg:pt-10">
        {/* left — the pitch */}
        <div className="reveal">
          <h1
            id="hero-heading"
            className="font-display text-[2.6rem] font-semibold leading-[1.18] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]"
          >
            {profile.headline.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.map((segment, segmentIndex) =>
                  segment.tone ? (
                    <span key={segmentIndex} className={markClass[segment.tone]}>
                      {segment.text}
                    </span>
                  ) : (
                    <span key={segmentIndex}>{segment.text}</span>
                  ),
                )}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-xl font-medium leading-relaxed text-ink/85">
            {profile.summary}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas shadow-lift transition-transform duration-300 hover:-translate-y-0.5"
            >
              看看我在做什么
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-hair bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-grass hover:text-grass-deep"
            >
              读读博客
            </Link>
          </div>
        </div>

        {/* right — waving 小双 illustration */}
        <div className="reveal flex justify-center [animation-delay:120ms]">
          <div className="relative">
            <Image
              src="/xiaoshuang-hero.png"
              alt={`${profile.name}的卡通形象：抱着 MacBook 向你挥手打招呼`}
              width={581}
              height={951}
              priority
              unoptimized
              className="hero-bob h-auto w-auto max-h-[26rem] select-none drop-shadow-[0_20px_34px_rgba(37,42,60,0.1)] sm:max-h-[30rem] lg:max-h-[38rem]"
            />
            {/* soft ground shadow — gently pulses so the bob reads as hovering */}
            <div
              aria-hidden
              className="hero-shadow pointer-events-none absolute inset-x-6 -bottom-1 -z-10 h-5 rounded-[50%] bg-ink/15 blur-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
