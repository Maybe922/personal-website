# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 项目是什么

小双（Eric）的个人网站 https://shuang229.xyz —— 手绘风名片 + 项目橱窗 + 全平台粉丝信号台 + Markdown 博客（「实验日志本」）。中文站点，UI 文案全部中文。

## 常用命令

```bash
npm run dev                      # 本地开发
npm run build                    # 生产构建（改动验证必跑）
npx tsc --noEmit --pretty false  # 类型检查
npx eslint <files>               # lint
```

没有测试框架。视觉改动用 playwright-core + 系统 Chrome 截图验证：
`chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })`。

## 架构

技术栈：Next.js 16 App Router（无 cacheComponents，用经典 `next: { revalidate }` ISR）+ React 19 + Tailwind v4。设计 token 全部在 `src/app/globals.css` 的 `@theme` 块（奶油底 canvas / 墨色 ink / 草绿 grass / 蜜桃 peach），组件里不许硬编码色值。

**两条内容管线，改内容不用改组件：**

1. **首页内容** 全部集中在 `src/lib/site-data.ts`（profile / projects / socials / channels）。改文案、加项目、换链接只动这个文件。
2. **博客** 是文件即文章：`content/posts/*.md`（frontmatter：title / date / tags / excerpt / cover 可选）→ `src/lib/posts.ts` 用 fs 同步读 → `/blog` 列表 + `/blog/[slug]` SSG。新增 md 后页面通过 `POST /api/revalidate`（`x-revalidate-secret` 头，env `REVALIDATE_SECRET`）即时刷新，不用重新 build。

**动态数据：** `SignalBoard`（全平台信号台）是 async server component，从 `https://earn2play.fun/api/followers` 拉粉丝数（revalidate 1h + 5s 超时），失败时回落到 site-data.ts 里的静态 followers。数据源头是 gta6-challenge 项目的 SQLite，经 TG bot `/fans` 同步。

**Markdown 排版：** 正文样式集中在 globals.css 的 `.post-body` 块。标题荧光笔是逐行画的——`MarkdownBody.tsx` 用 react-markdown 的 components 把 h1/h2 内容包进 `.heading-mark` span，配 `box-decoration-break: clone`，折行标题每行荧光笔各自贴字。改标题样式动 span 不动块。

**TG 管理 bot（`bot/`）：** 独立 Node 进程（自己的 package.json，依赖 better-sqlite3），不参与 Next 构建。收 .md 文件 → 校验/自动补 frontmatter → 写 `content/posts/` → 调 revalidate；收图片 → 存 `public/blog/`；`/fans` 写 gta6-challenge 的库。只认 `TG_ALLOWED_USER_ID`。测试时 `BOT_SKIP_START=1` 再 import（pm2 fork 模式下不能用 argv 判断主入口——踩过坑）。

## 部署（腾讯云 VPS）

生产在 `/home/ubuntu/personal-website`，pm2 跑三个相关进程：`website`（next start，PORT=3200，带 REVALIDATE_SECRET）、`website-bot`（bot/index.js，带 TG token）、Caddy 反代 shuang229.xyz 并自动 HTTPS。凭据问用户要，不写进仓库。

标准发布流程：

```bash
git pull
NODE_OPTIONS=--max-old-space-size=1024 npm run build   # 2C/2G 小机器，限内存
pm2 restart website        # 只改 bot 则 restart website-bot，不用 build
```

注意：服务器上 `content/posts/` 和 `public/blog/` 有 bot 发布的、不在 git 里的文章和图片——部署永远用 git pull，不要 rsync/scp 整目录覆盖。

## 设计红线（用户已确认的偏好）

- 手绘风：贴纸、washi 胶带、卡片微倾、虚线邮票框、荧光笔高亮；不要模板感的规整布局
- 配图流程：gen-image skill 生成（奶油底 #f7f5ee）→ sharp 角采样抠底转透明 webp，不要直接生成透明底（模型不支持）
- 分享卡片（og.png）只有标题 + 手绘图，og:description 是单个空格——故意的，防止 Next 从 description 继承文案
