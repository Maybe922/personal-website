"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { profile } from "@/lib/site-data";
import { MenuIcon, CloseIcon } from "@/components/icons";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "项目", href: "/#projects" },
  { label: "博客", href: "/blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-canvas/55 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
        <Link
          href="/"
          className="group relative font-display text-[18px] font-semibold tracking-tight text-ink"
          aria-label={`${profile.name} 首页`}
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

        <nav className="hidden items-center gap-1 rounded-full border border-hair/80 bg-canvas/70 px-2 py-1.5 shadow-soft backdrop-blur-md md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors duration-200 hover:bg-grass-soft hover:text-grass-deep"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="ml-1 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-canvas transition-transform duration-200 hover:-translate-y-0.5"
          >
            聊聊
          </Link>
        </nav>

        <div className="md:hidden">
          <Button
            isIconOnly
            variant="tertiary"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onPress={() => setOpen((v) => !v)}
            className="rounded-full border border-hair/80 bg-canvas/70 shadow-soft backdrop-blur-md"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="mx-auto max-w-5xl px-5 md:hidden">
          <nav className="reveal flex flex-col gap-1 rounded-3xl border border-hair bg-canvas/95 p-3 shadow-lift backdrop-blur-md">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-grass-soft hover:text-grass-deep"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-2xl bg-ink px-4 py-3 text-center text-base font-medium text-canvas"
            >
              聊聊
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
