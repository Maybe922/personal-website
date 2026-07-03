import type { SVGProps } from "react";
import type { SocialLink } from "@/lib/site-data";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21.5 4.5 2.5 11.8c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.3c.3.8 1.3 1 1.9.3l2.5-2.6 4.6 3.4c.7.5 1.7.1 1.9-.7l3.1-15c.2-1-.8-1.9-1.9-1.6Z" />
      <path d="m7.2 14.9 10.4-7.2-8 8.5" />
    </svg>
  );
}

export function XianyuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9.5C6 6.5 8.5 4 12 4s6 2.5 6 5.5c0 2-1.5 3.5-1.5 5 0 2 .8 3.2 2 4.5-2.2.4-3.9-.3-5-1.6-.5.1-1 .2-1.5.2s-1-.1-1.5-.2c-1.1 1.3-2.8 2-5 1.6 1.2-1.3 2-2.5 2-4.5 0-1.5-1.5-3-1.5-5Z" />
      <path d="M9.5 10h.01M14.5 10h.01" />
    </svg>
  );
}

export function WechatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* 大小两个聊天气泡 */}
      <path d="M9.8 4C6.1 4 3 6.5 3 9.5c0 1.7 1 3.3 2.5 4.3l-.6 2.3 2.6-1.4" />
      <path d="M21 13.5c0-2.5-2.4-4.5-5.3-4.5s-5.3 2-5.3 4.5 2.4 4.5 5.3 4.5c.7 0 1.4-.1 2-.3l2.3 1.2-.5-2.1c.9-.8 1.5-2 1.5-3.3Z" />
      <g fill="currentColor" stroke="none">
        <circle cx="7.3" cy="8.6" r="0.95" />
        <circle cx="11.6" cy="8.6" r="0.95" />
        <circle cx="13.7" cy="13.1" r="0.85" />
        <circle cx="17.7" cy="13.1" r="0.85" />
      </g>
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.25 6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3Z" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 15 15 9" />
      <path d="M11 6.5 12.5 5a4 4 0 0 1 5.7 5.7L16.5 12" />
      <path d="M13 17.5 11.5 19a4 4 0 0 1-5.7-5.7L7.5 12" />
    </svg>
  );
}

export function RssIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 5a15 15 0 0 1 15 15" />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

/** 按 social 的 icon 键渲染对应图标 */
export function SocialGlyph({
  icon,
  ...props
}: { icon: SocialLink["icon"] } & IconProps) {
  switch (icon) {
    case "github":
      return <GithubIcon {...props} />;
    case "telegram":
      return <TelegramIcon {...props} />;
    case "xianyu":
      return <XianyuIcon {...props} />;
    case "x":
      return <XIcon {...props} />;
    case "wechat":
      return <WechatIcon {...props} />;
    case "mail":
      return <MailIcon {...props} />;
    case "rss":
      return <RssIcon {...props} />;
    default:
      return <LinkIcon {...props} />;
  }
}
