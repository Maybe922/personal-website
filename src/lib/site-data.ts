/**
 * Single source of truth for site content.
 * 这是整个网站的内容中心 —— 想改文案 / 链接 / 项目，只改这个文件即可。
 * 带 TODO 的地方是占位，换成你的真实信息。
 */

export type Profile = {
  name: string;
  handle: string;
  role: string;
  location: string;
  /** 一句话自我介绍，出现在 hero 主标题下方与 meta description */
  summary: string;
  /** hero 大字宣言，按行拆分；带 tone 的片段渲染为马克笔高亮 */
  headline: HeadlineSegment[][];
  /** 头像图片路径（放到 public/ 下）；留空则用姓名首字母 */
  avatar?: string;
  /** 名字首字母，头像缺省时的 fallback */
  initials: string;
  email: string;
};

export type HeadlineSegment = {
  text: string;
  /** 指定色调时渲染为该色的马克笔底色 */
  tone?: "grass" | "peach";
};

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  /** 状态标签，驱动颜色语义 */
  status: "live" | "building" | "paused" | "archived";
  /** 覆盖状态的默认文案，比如「攒着呢」 */
  statusLabel?: string;
  /** 技术 / 关键词标签 */
  tags: string[];
  href?: string;
  /** 年份或时间跨度 */
  period: string;
  /** 卡片顶部的手绘配图（public/ 下路径，3:2 横版） */
  cover?: string;
  /** 配图的无障碍描述 */
  coverAlt?: string;
  /** true 时在项目区占据更大的编辑位（bento 突出） */
  featured?: boolean;
};

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  /** 图标键，见 components/icons.tsx */
  icon: "github" | "mail" | "telegram" | "xianyu" | "x" | "wechat" | "link" | "rss";
};

export type Channel = {
  /** 平台名 */
  label: string;
  /** 账号名 / handle */
  handle: string;
  /** 主页链接；填 "#" 表示还没链接，渲染为不可点 */
  href: string;
  icon: "xiaohongshu" | "wechat" | "douyin" | "x" | "bilibili";
  /** 粉丝数，null = 还没同步过（显示 —）。每周手动同步，后续可换成 VPS API */
  followers: number | null;
  /** live = 已开播，soon = 账号还没起 */
  status: "live" | "soon";
};

/* ------------------------------------------------------------------ */

export const profile: Profile = {
  name: "小双",
  handle: "eric",
  role: "独立开发者 / Maker",
  location: "中国 · 2026 届",
  summary: "一个 00 后的公开实测：从第一个 $1，一路撬到财富自由",
  headline: [
    [{ text: "AI", tone: "peach" }],
    [{ text: "是我最好的" }],
    [{ text: "杠杆", tone: "grass" }],
  ],
  initials: "小",
  // TODO: 把头像放到 public/avatar.jpg 再取消下一行注释
  // avatar: "/avatar.jpg",
  email: "maybeeric173@gmail.com",
};

export const projects: Project[] = [
  {
    slug: "fanka-shop",
    name: "双吉AI小卖部",
    blurb:
      "一台 24 小时不打烊的 AI 数字商品售货机，付款、发货、对账全自动 —— 我睡觉的时候它也在营业。",
    status: "live",
    tags: ["Next.js", "自动发卡", "支付", "VPS"],
    href: "https://cngptplus.shop",
    period: "2026",
    cover: "/projects/fanka.webp",
    coverAlt: "小双站在自动售货机旁，机器叮地吐出一张卡片，他伸手接住",
    featured: true,
  },
  {
    slug: "earn2play",
    name: "earn2play — 公开记账站",
    blurb:
      "这场赌局的第一关：让 AI 赚出一台主机和 GTA6。公开记账，只统计 AI 帮我赚到的钱，配 Telegram 随手记 bot。",
    status: "live",
    statusLabel: "攒着呢",
    tags: ["SQLite", "pm2", "Telegram Bot"],
    href: "https://earn2play.fun",
    period: "2026 → 2026.11",
    cover: "/projects/earn2play.webp",
    coverAlt: "小双抱着一只大存钱罐，一枚金币正掉进去，脚边放着写有 GTA6 的游戏手柄",
    featured: true,
  },
  {
    slug: "ts3-deploy",
    name: "TeamSpeak 一键开黑服",
    blurb:
      "一条命令拉起自己的 TeamSpeak 语音服务器：频道、权限、管理 bot 全自动配好，和朋友开黑不再求人。",
    status: "live",
    tags: ["TeamSpeak", "Bot", "一键部署"],
    href: "https://github.com/Maybe922/ts3-server-bot",
    period: "2026",
    cover: "/projects/ts3.webp",
    coverAlt: "小双戴着游戏耳机按下一个大按钮，旁边的服务器机箱里探出机器人，头顶飘着几个语音气泡",
  },
];

export const socials: SocialLink[] = [
  {
    label: "Email",
    handle: "maybeeric173@gmail.com",
    href: "mailto:maybeeric173@gmail.com",
    icon: "mail",
  },
  {
    label: "微信",
    handle: "Ericttkx_",
    href: "#", // 微信没有主页链接，卡片仅展示
    icon: "wechat",
  },
  {
    label: "Telegram",
    handle: "@Ericttx_229",
    href: "https://t.me/Ericttx_229",
    icon: "telegram",
  },
];

/** 全平台信号台：自媒体账号矩阵。粉丝数每周手动同步一次（上次 2026-07-03） */
export const channels: Channel[] = [
  {
    label: "小红书",
    handle: "Shuang",
    href: "https://xhslink.com/m/6S4ooZIQpXM",
    icon: "xiaohongshu",
    followers: 5959,
    status: "live",
  },
  {
    label: "公众号",
    handle: "小双22",
    href: "#",
    icon: "wechat",
    followers: 431,
    status: "live",
  },
  {
    label: "抖音",
    handle: "小双",
    href: "#",
    icon: "douyin",
    followers: 18,
    status: "live",
  },
  {
    label: "X",
    handle: "@Shuangzku5",
    href: "https://x.com/Shuangzku5",
    icon: "x",
    followers: 819,
    status: "live",
  },
  {
    label: "B站",
    handle: "小双229",
    href: "https://space.bilibili.com/382841481",
    icon: "bilibili",
    followers: 670,
    status: "live",
  },
];

/** 状态标签的中文与语义色，供 UI 复用 */
export const statusMeta: Record<
  Project["status"],
  { label: string; tone: "grass" | "peach" | "ink" | "sky" }
> = {
  live: { label: "跑着呢", tone: "grass" },
  building: { label: "在搭", tone: "peach" },
  paused: { label: "歇着", tone: "ink" },
  archived: { label: "收进抽屉了", tone: "sky" },
};
