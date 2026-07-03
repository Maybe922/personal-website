// 个人网站 Telegram bot —— 长轮询（getUpdates），无需公网 webhook。
// 能干三件事：
//   1. 发 .md 文件 → 直接发布到博客（写入 content/posts/，即时刷新页面）
//   2. 发图片 → 存到 public/blog/，回你封面路径，贴进 frontmatter 就能用
//   3. /fans 小红书 6100 → 同步「全平台信号台」粉丝数（写 gta6 挑战站的库）
// 只认主人（TG_ALLOWED_USER_ID），别人发消息一律拒绝。
import {
  writeFileSync,
  readdirSync,
  readFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
} from "node:fs";
import { join, basename } from "node:path";
import Database from "better-sqlite3";

const TOKEN = process.env.TG_BOT_TOKEN;
const OWNER_ID = String(process.env.TG_ALLOWED_USER_ID || "").trim();
const SITE_DIR = process.env.SITE_DIR || "/home/ubuntu/personal-website";
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://shuang229.xyz";
const FANS_DB_PATH =
  process.env.FANS_DB_PATH || "/home/ubuntu/gta6-challenge/data/challenge.db";
const REVALIDATE_URL =
  process.env.REVALIDATE_URL || "http://localhost:3200/api/revalidate";
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "";

const POSTS_DIR = join(SITE_DIR, "content", "posts");
const COVERS_DIR = join(SITE_DIR, "public", "blog");
const MAX_MD_BYTES = 1024 * 1024; // 文章上限 1MB
const MAX_IMG_BYTES = 8 * 1024 * 1024; // 图片上限 8MB

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Telegram API ────────────────────────────────────────
const apiUrl = (method) => `https://api.telegram.org/bot${TOKEN}/${method}`;

async function tgCall(method, payload, timeoutMs = 65000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(apiUrl(method), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    return await r.json();
  } finally {
    clearTimeout(timer);
  }
}

function send(chatId, text) {
  return tgCall(
    "sendMessage",
    { chat_id: chatId, text, disable_web_page_preview: true },
    15000
  ).catch(() => {});
}

/** 按 file_id 拉取 Telegram 上的文件内容，超限或失败返回 null */
async function downloadFile(fileId, maxBytes) {
  const info = await tgCall("getFile", { file_id: fileId }, 15000);
  if (!info || !info.ok || !info.result.file_path) return null;
  if (info.result.file_size && info.result.file_size > maxBytes) return null;
  const url = `https://api.telegram.org/file/bot${TOKEN}/${info.result.file_path}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) return null;
  const buf = Buffer.from(await r.arrayBuffer());
  return buf.length > maxBytes ? null : buf;
}

// ── 粉丝数同步（/fans，写 gta6 挑战站的 SQLite） ────────
// 平台 key 与网站 site-data.ts 里 Channel.icon 一一对应。
const PLATFORMS = [
  { key: "xiaohongshu", label: "小红书", aliases: ["小红书", "xhs", "红书"] },
  { key: "wechat", label: "公众号", aliases: ["公众号", "gzh", "微信公众号", "微信"] },
  { key: "douyin", label: "抖音", aliases: ["抖音", "dy", "douyin"] },
  { key: "x", label: "X", aliases: ["x", "推特", "twitter", "推"] },
  { key: "bilibili", label: "B站", aliases: ["b站", "bilibili", "bili", "哔哩哔哩"] },
];

const findPlatform = (name) => {
  const n = name.trim().toLowerCase();
  return PLATFORMS.find((p) => p.aliases.includes(n)) || null;
};
const platformLabel = (key) =>
  (PLATFORMS.find((p) => p.key === key) || { label: key }).label;

function openFansDb() {
  const db = new Database(FANS_DB_PATH);
  db.pragma("journal_mode = WAL");
  return db;
}

function latestFollowers(db) {
  return db
    .prepare(
      `SELECT f.platform, f.count, f.date FROM followers f
       JOIN (SELECT platform, MAX(rowid) AS r FROM followers GROUP BY platform) m
       ON f.rowid = m.r`
    )
    .all();
}

function ymdStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 每行「平台 数字」，支持一条消息发多行 */
export function parseFans(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const updates = [];
  for (const line of lines) {
    const m = line.match(/^(\S+)\s+(\d[\d,]*)$/);
    if (!m) return { error: `没看懂「${line}」～ 每行一个平台：「小红书 6100」` };
    const platform = findPlatform(m[1]);
    if (!platform) {
      return {
        error: `不认识平台「${m[1]}」～ 支持：${PLATFORMS.map((p) => p.label).join(" / ")}`,
      };
    }
    const count = Number(m[2].replace(/,/g, ""));
    if (!Number.isFinite(count) || count < 0) return { error: `「${line}」的数字不对哦` };
    updates.push({ platform: platform.key, count });
  }
  if (!updates.length) return { error: "格式：/fans 小红书 6100（可一次发多行）" };
  return { value: updates };
}

function handleFans(chatId, text) {
  const rest = text.replace(/^\/fans\b/, "").trim();
  let db;
  try {
    db = openFansDb();
  } catch (_) {
    return send(chatId, "❌ 粉丝库打不开，看看挑战站还活着没");
  }
  try {
    if (!rest) {
      const rows = latestFollowers(db);
      if (!rows.length) return send(chatId, "还没有同步过粉丝数～ 发「/fans 小红书 6100」记第一笔");
      const byKey = new Map(rows.map((r) => [r.platform, r]));
      const lines = PLATFORMS.filter((p) => byKey.has(p.key)).map((p) => {
        const r = byKey.get(p.key);
        return `${p.label}  ${r.count.toLocaleString("en-US")}（${r.date} 同步）`;
      });
      return send(chatId, "📡 全平台信号台\n" + lines.join("\n"));
    }

    const parsed = parseFans(rest);
    if (parsed.error) return send(chatId, "⚠️ " + parsed.error);

    const prev = new Map(latestFollowers(db).map((r) => [r.platform, r.count]));
    const date = ymdStr(new Date());
    const ins = db.prepare(
      "INSERT INTO followers(id, platform, count, date) VALUES(@id,@platform,@count,@date)"
    );
    const lines = [];
    for (const u of parsed.value) {
      ins.run({ id: crypto.randomUUID(), platform: u.platform, count: Math.round(u.count), date });
      const before = prev.get(u.platform);
      const delta =
        before == null
          ? ""
          : `（${u.count - before >= 0 ? "+" : ""}${(u.count - before).toLocaleString("en-US")}）`;
      lines.push(`${platformLabel(u.platform)}  ${u.count.toLocaleString("en-US")}${delta}`);
    }
    return send(chatId, "📡 粉丝数已同步！\n" + lines.join("\n"));
  } catch (_) {
    return send(chatId, "❌ 没存上，稍后再发一次试试");
  } finally {
    try {
      db.close();
    } catch (_) {}
  }
}

// ── 发布文章（.md 文件） ────────────────────────────────
/** 文件名 / caption → 合法 slug；中文等非法字符会被剔掉，剔空则退回时间戳 */
function toSlug(raw) {
  const s = String(raw || "")
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return s || null;
}

function timestampSlug() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `post-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

/** 从正文抽第一段普通文字当摘要（跳过标题/图片/代码块/列表等） */
function extractExcerpt(body) {
  let inFence = false;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line) continue;
    if (/^(#|!\[|>|\||[-*+]\s|\d+\.\s|---)/.test(line)) continue;
    const text = line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim();
    if (text) return text.slice(0, 80);
  }
  return "（待补摘要）";
}

/**
 * 保证文章带够发布用的 frontmatter：缺 title/date/excerpt 就自动补，
 * 完全没有 frontmatter 也能发（标题取第一个 # 大标题或文件名）。
 * 返回 { md, title, added }，added 是自动补上的字段名列表。
 */
export function ensureFrontmatter(md, fallbackTitle) {
  const today = ymdStr(new Date());
  const hasField = (fm, k) => new RegExp(`^${k}\\s*:\\s*\\S`, "m").test(fm);
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (m) {
    const fm = m[1];
    const body = md.slice(m[0].length);
    const added = [];
    let extra = "";
    if (!hasField(fm, "title")) {
      extra += `title: ${JSON.stringify(fallbackTitle)}\n`;
      added.push("title");
    }
    if (!hasField(fm, "date")) {
      extra += `date: ${today}\n`;
      added.push("date");
    }
    if (!hasField(fm, "excerpt")) {
      extra += `excerpt: ${JSON.stringify(extractExcerpt(body))}\n`;
      added.push("excerpt");
    }
    const rawTitle = (fm.match(/^title\s*:\s*(.+)$/m) || [])[1];
    const title = rawTitle
      ? rawTitle.trim().replace(/^["']|["']$/g, "")
      : fallbackTitle;
    if (!added.length) return { md, title, added };
    return { md: `---\n${fm}\n${extra}---\n${body}`, title, added };
  }

  // 完全没有 frontmatter：标题取第一个 # 大标题（并从正文去掉，免得页面标题重复）
  let body = md;
  let title = fallbackTitle;
  const h1 = body.match(/^\s*#\s+(.+?)\s*$/m);
  if (h1) {
    title = h1[1].trim();
    body = body.replace(h1[0], "").replace(/^\s+/, "");
  }
  const fm = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: ${today}`,
    "tags: []",
    `excerpt: ${JSON.stringify(extractExcerpt(body))}`,
    "---",
    "",
  ].join("\n");
  return { md: fm + body, title, added: ["title", "date", "tags", "excerpt"] };
}

async function refreshSite() {
  if (!REVALIDATE_SECRET) return false;
  try {
    const r = await fetch(REVALIDATE_URL, {
      method: "POST",
      headers: { "x-revalidate-secret": REVALIDATE_SECRET },
      signal: AbortSignal.timeout(10000),
    });
    return r.ok;
  } catch (_) {
    return false;
  }
}

async function handleMarkdown(chatId, doc, caption) {
  const buf = await downloadFile(doc.file_id, MAX_MD_BYTES);
  if (!buf) return send(chatId, "❌ 文件拉不下来（或超过 1MB），再发一次试试");

  const fallbackTitle = String(doc.file_name || "未命名")
    .replace(/\.md$/i, "")
    .replace(/[.\s]+$/, "");
  const { md, title, added } = ensureFrontmatter(buf.toString("utf8"), fallbackTitle);

  const slug = toSlug(caption) || toSlug(doc.file_name) || timestampSlug();
  const target = join(POSTS_DIR, `${slug}.md`);
  const isUpdate = existsSync(target);
  try {
    writeFileSync(target, md, "utf8");
  } catch (e) {
    console.error("[bot] 写文章失败", e);
    return send(chatId, "❌ 写不进去，稍后再试");
  }

  const refreshed = await refreshSite();
  return send(
    chatId,
    [
      `${isUpdate ? "♻️ 已更新" : "🎉 已发布"}《${title}》`,
      `${SITE_ORIGIN}/blog/${slug}`,
      added.length ? `已自动补 frontmatter：${added.join("、")}（重发同名文件可覆盖修改）` : "",
      refreshed ? "" : "（页面刷新没成功，稍等缓存过期或喊我看看）",
    ]
      .filter(Boolean)
      .join("\n")
  );
}

// ── 存封面图（photo 或图片文件） ────────────────────────
const IMG_EXT = /\.(webp|png|jpe?g|gif|avif)$/i;

async function handleImage(chatId, msg) {
  let fileId;
  let name;
  if (msg.photo && msg.photo.length) {
    fileId = msg.photo[msg.photo.length - 1].file_id; // 最大尺寸那张
    name = `${toSlug(msg.caption) || timestampSlug()}.jpg`;
  } else {
    const doc = msg.document;
    fileId = doc.file_id;
    const base = basename(doc.file_name || "");
    name = IMG_EXT.test(base)
      ? `${toSlug(base.replace(IMG_EXT, "")) || timestampSlug()}${base.match(IMG_EXT)[0].toLowerCase()}`
      : null;
    if (!name) return send(chatId, "⚠️ 只收 webp / png / jpg / gif / avif 格式的图");
  }

  const buf = await downloadFile(fileId, MAX_IMG_BYTES);
  if (!buf) return send(chatId, "❌ 图片拉不下来（或超过 8MB），再发一次试试");

  try {
    mkdirSync(COVERS_DIR, { recursive: true });
    writeFileSync(join(COVERS_DIR, name), buf);
  } catch (e) {
    console.error("[bot] 存图失败", e);
    return send(chatId, "❌ 存不进去，稍后再试");
  }
  return send(
    chatId,
    ["🖼️ 图片存好了！frontmatter 里这样引用：", "", `cover: "/blog/${name}"`].join("\n")
  );
}

// ── 删除文章（/del，二次确认防手滑） ────────────────────
async function handleDel(chatId, text) {
  const args = text.replace(/^\/del\b/, "").trim().split(/\s+/).filter(Boolean);
  const [rawSlug, confirm] = args;
  if (!rawSlug) return send(chatId, "格式：/del 文章slug\n先发 /posts 看看都有哪些");

  // slug 只可能是 toSlug 产出的字符集，其余一律拒绝，杜绝路径逃逸
  if (!/^[a-z0-9-]+$/.test(rawSlug)) return send(chatId, `⚠️ 没有这样的 slug「${rawSlug}」`);
  const target = join(POSTS_DIR, `${rawSlug}.md`);
  if (!existsSync(target)) {
    return send(chatId, `找不到「${rawSlug}」～ 发 /posts 核对一下`);
  }

  let title = rawSlug;
  try {
    const m = readFileSync(target, "utf8").match(/^title\s*:\s*(.+)$/m);
    if (m) title = m[1].trim().replace(/^["']|["']$/g, "");
  } catch (_) {}

  if (confirm !== "yes") {
    return send(
      chatId,
      `⚠️ 要删《${title}》吗？删了就没了！\n\n确认请发：/del ${rawSlug} yes`
    );
  }

  try {
    unlinkSync(target);
  } catch (e) {
    console.error("[bot] 删文章失败", e);
    return send(chatId, "❌ 没删掉，稍后再试");
  }
  const refreshed = await refreshSite();
  return send(
    chatId,
    [`🗑️ 已删除《${title}》`, refreshed ? "" : "（页面刷新没成功，稍等缓存过期或喊我看看）"]
      .filter(Boolean)
      .join("\n")
  );
}

// ── 文章清单（/posts） ──────────────────────────────────
function handlePosts(chatId) {
  let files;
  try {
    files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  } catch (_) {
    return send(chatId, "❌ 读不到文章目录");
  }
  if (!files.length) return send(chatId, "日志本还是空的～ 发个 .md 给我就能发布第一篇");
  const lines = files.map((f) => `· ${f.replace(/\.md$/, "")}`);
  return send(chatId, `📓 日志本里有 ${files.length} 篇：\n` + lines.join("\n"));
}

// ── 文案 ────────────────────────────────────────────────
function helpText() {
  return [
    "🌐 小双网站管理 bot",
    "",
    "📝 发布文章：直接把 .md 文件发给我",
    "   · 纯 md 也行，缺 frontmatter 我自动补（标题/日期/摘要）",
    "   · 文件名就是网址 slug（也可在 caption 里指定）",
    "   · 重发同名文件 = 更新文章",
    "🖼️ 传封面：直接发图片，回你 cover 路径",
    "   · caption 写英文名可自定义文件名",
    "",
    "/fans   看各平台粉丝数",
    "/fans 小红书 6100   同步粉丝数（可一次发多行）",
    "/posts  看已发布的文章",
    "/del 文章slug   删除文章（会先让你确认）",
    "/help   看帮助",
  ].join("\n");
}

async function handleMessage(msg) {
  const chatId = msg.chat && msg.chat.id;
  if (!chatId) return;

  // 文件优先：md 发布 / 图片存封面
  if (msg.document) {
    const name = msg.document.file_name || "";
    if (/\.md$/i.test(name)) return handleMarkdown(chatId, msg.document, msg.caption);
    if (IMG_EXT.test(name) || (msg.document.mime_type || "").startsWith("image/")) {
      return handleImage(chatId, msg);
    }
    return send(chatId, "⚠️ 只认 .md 文章和图片～");
  }
  if (msg.photo && msg.photo.length) return handleImage(chatId, msg);

  const text = (msg.text || "").trim();
  if (!text) return;
  if (text === "/start" || text === "/help") return send(chatId, helpText());
  if (text === "/posts") return handlePosts(chatId);
  if (text === "/del" || text.startsWith("/del ")) return handleDel(chatId, text);
  if (text === "/fans" || text.startsWith("/fans ") || text.startsWith("/fans\n")) {
    return handleFans(chatId, text);
  }
  return send(chatId, "发 .md 文件给我就能发布文章～\n\n" + helpText());
}

// ── 主循环 ──────────────────────────────────────────────
// 启动先排空积压，避免重启时把停机期间的旧消息重复处理一遍。
async function drain() {
  try {
    const res = await tgCall("getUpdates", { offset: -1, timeout: 0 }, 15000);
    const list = (res && res.ok && res.result) || [];
    if (list.length) return list[list.length - 1].update_id + 1;
  } catch (_) {}
  return 0;
}

async function loop() {
  let offset = await drain();
  console.log("🤖 网站管理 bot 已上线");
  for (;;) {
    let updates;
    try {
      const res = await tgCall("getUpdates", { offset, timeout: 50 });
      updates = (res && res.ok && res.result) || [];
    } catch (_) {
      await sleep(3000);
      continue;
    }
    for (const u of updates) {
      offset = u.update_id + 1;
      const msg = u.message || u.edited_message;
      if (!msg || !msg.from) continue;
      if (String(msg.from.id) !== OWNER_ID) {
        if (msg.chat && msg.chat.id) send(msg.chat.id, "🚫 这是私人管理 bot，不对外开放～");
        continue;
      }
      try {
        await handleMessage(msg);
      } catch (e) {
        console.error("[bot] 处理消息出错", e);
      }
    }
  }
}

// 测试 import 时设 BOT_SKIP_START=1 跳过；其余情况一律启动
// （不能用 process.argv[1] 判断主入口：pm2 fork 模式下它指向 pm2 的包装脚本）
if (process.env.BOT_SKIP_START !== "1") {
  if (!TOKEN || !OWNER_ID) {
    console.error("缺 TG_BOT_TOKEN 或 TG_ALLOWED_USER_ID，bot 不启动");
    process.exit(1);
  }
  loop().catch((e) => {
    console.error("[bot] 致命错误", e);
    process.exit(1);
  });
}
