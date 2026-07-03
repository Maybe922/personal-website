import { socials } from "@/lib/site-data";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { CopyCard } from "@/components/contact/CopyCard";
import { SocialGlyph, ArrowUpRight } from "@/components/icons";

/** 三张联系卡片的歪斜角度 + 胶带颜色 + 图标底色，按位置轮换（同项目卡片语言） */
const tilt = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1"];
const tape = ["bg-grass/35", "bg-peach/45", "bg-sky/30"];
const chip = [
  "bg-grass-soft text-grass-deep",
  "bg-[#07c160]/12 text-[#079a4e]",
  "bg-sky/25 text-ink-soft",
];

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading title="找我聊聊" />

        <p className="mt-10 text-center font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          项目、合作、idea or 分享，
          <span className="bg-[linear-gradient(transparent_60%,--alpha(var(--color-peach)/70%)_60%)]">
            随时来！
          </span>
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {socials.map((social, index) => {
            const isLink = social.href !== "#";
            const isExternal = social.href.startsWith("http");
            if (!isLink) {
              // 没有主页链接（微信）：整卡按钮，点击复制账号
              return (
                <CopyCard
                  key={social.label}
                  social={social}
                  tiltClass={tilt[index % tilt.length]}
                  tapeClass={tape[index % tape.length]}
                  chipClass={chip[index % chip.length]}
                />
              );
            }
            return (
              <a
                key={social.label}
                href={social.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group block rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <div
                  className={`relative h-full transition-transform duration-300 ease-out ${tilt[index % tilt.length]} hover:rotate-0 hover:-translate-y-1`}
                >
                  {/* 半透明胶带，和项目卡片一样「贴」在页面上 */}
                  <div
                    aria-hidden
                    className={`absolute -top-2.5 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-[2px] ${tape[index % tape.length]}`}
                  />
                  <div className="flex h-full items-center gap-4 rounded-[1.25rem] border border-hair bg-surface p-5 shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full ${chip[index % chip.length]}`}
                    >
                      <SocialGlyph icon={social.icon} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {social.label}
                      </span>
                      <span className="block truncate font-mono text-xs text-ink-faint">
                        {social.handle}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-grass-deep" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
