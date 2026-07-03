"use client";

import { useRef, useState } from "react";
import type { SocialLink } from "@/lib/site-data";
import { SocialGlyph, CopyIcon, CheckIcon } from "@/components/icons";

type Props = {
  social: SocialLink;
  /** 卡片歪斜 / 胶带 / 图标底盘的位置轮换样式，由父级传入保持三卡节奏一致 */
  tiltClass: string;
  tapeClass: string;
  chipClass: string;
};

const COPIED_RESET_MS = 2000;

/** 没有主页链接的联系方式（微信）：整卡是按钮，点击复制账号 */
export function CopyCard({ social, tiltClass, tapeClass, chipClass }: Props) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(social.handle);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(
        () => setCopied(false),
        COPIED_RESET_MS,
      );
    } catch {
      // 剪贴板不可用（非 https 等）：保持原样，账号本身就展示在卡片上
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "微信号已复制" : `复制微信号 ${social.handle}`}
      className="group block w-full cursor-pointer rounded-[1.25rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div
        className={`relative h-full transition-transform duration-300 ease-out ${tiltClass} hover:rotate-0 hover:-translate-y-1`}
      >
        <div
          aria-hidden
          className={`absolute -top-2.5 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-[2px] ${tapeClass}`}
        />
        <div className="flex h-full items-center gap-4 rounded-[1.25rem] border border-hair bg-surface p-5 shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-full ${chipClass}`}
          >
            <SocialGlyph icon={social.icon} className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">
              {social.label}
            </span>
            <span
              className={`block truncate font-mono text-xs ${copied ? "text-grass-deep" : "text-ink-faint"}`}
            >
              {copied ? "已复制，去微信加我 ✓" : social.handle}
            </span>
          </span>
          {copied ? (
            <CheckIcon className="size-4 shrink-0 text-grass-deep" />
          ) : (
            <CopyIcon className="size-4 shrink-0 text-ink-faint transition-colors duration-300 group-hover:text-grass-deep" />
          )}
        </div>
      </div>
    </button>
  );
}
