import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 家目录里有一个无关的 package-lock.json，会让 Next 误判工作区根目录。
  // 显式把 Turbopack 根目录锁定到本项目，消除告警。
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
