import { SectionHeading } from "@/components/section-heading/SectionHeading";

/** TODO: 想更新「现在」时改这里 —— 保持简短、诚实、随时更新 */
const focus: { label: string; detail: string; tone: string }[] = [
  {
    label: "冲毕设答辩",
    detail: "STM32 毕业设计收尾，准备答辩。学生身份进入倒计时。",
    tone: "bg-grass-soft text-grass-deep",
  },
  {
    label: "养发卡网",
    detail: "让双吉 AI 发卡网稳定跑起来，打磨教程外链，尝试真正破零。",
    tone: "bg-peach-soft text-peach-deep",
  },
  {
    label: "公开记账",
    detail: "earn2play 每天记录 AI 帮我赚到的钱，截止 2026 年 11 月。",
    tone: "bg-sky/20 text-ink-soft",
  },
];

export function NowPanel() {
  return (
    <section id="now" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading
          kicker="02 — 此刻"
          title="现在在做什么"
          aside={
            <span className="font-mono text-xs text-ink-faint">
              最近更新 · 2026
            </span>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {focus.map((item, i) => (
            <article
              key={item.label}
              className="dot-grid relative flex flex-col rounded-[1.5rem] border border-hair bg-surface/80 p-6"
            >
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 font-mono text-xs font-medium ${item.tone}`}
              >
                {String(i + 1).padStart(2, "0")} / {item.label}
              </span>
              <p className="mt-5 text-pretty text-[15px] leading-relaxed text-ink-soft">
                {item.detail}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft">
          我不太擅长把一件事情做到完美收尾 —— 所以干脆把过程公开出来，
          用一点点外部压力，逼自己把「差不多」变成「做完了」。
          <span className="text-grass-deep"> 第一块钱，是最难也最值得的证明。</span>
        </p>
      </div>
    </section>
  );
}
