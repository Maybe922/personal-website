"use client";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hair">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <p className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} Eric
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-grass-deep"
        >
          回到顶部
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
          >
            <path d="M8 13V3" />
            <path d="M3.5 7.5 8 3l4.5 4.5" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
