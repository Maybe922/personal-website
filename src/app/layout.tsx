import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/site-data";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shuang229.xyz"),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.summary,
  keywords: ["独立开发", "maker", "side project", profile.name, profile.handle],
  authors: [{ name: profile.name }],
  // 分享卡片：只留标题 + 手绘大图，不带文案（显式置空防止继承 description）
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: "",
    type: "website",
    locale: "zh_CN",
    url: "https://shuang229.xyz",
    siteName: profile.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "小双的手绘名片" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="grain relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
