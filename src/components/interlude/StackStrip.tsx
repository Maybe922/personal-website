import type { CSSProperties } from "react";
import {
  siC,
  siCplusplus,
  siGit,
  siGithub,
  siLinux,
  siNeteasecloudmusic,
} from "simple-icons";
import styles from "@/components/interlude/interlude.module.css";

type StackItem = {
  name: string;
  path: string;
  /** 荧光笔色号：grass = 左半排，peach = 右半排，pivot = 中间的网易云红 */
  tone: "grass" | "peach" | "pivot";
};

/** 通用数据库圆柱图标（非品牌，simple-icons 里没有） */
const DATABASE_PATH =
  "M12 2C7.58 2 4 3.34 4 5s3.58 3 8 3 8-1.34 8-3-3.58-3-8-3ZM4 7.5v3c0 1.66 3.58 3 8 3s8-1.34 8-3v-3c-1.7 1.3-4.7 2-8 2s-6.3-.7-8-2Zm0 5.5v3c0 1.66 3.58 3 8 3s8-1.34 8-3v-3c-1.7 1.3-4.7 2-8 2s-6.3-.7-8-2Zm0 5.5V19c0 1.66 3.58 3 8 3s8-1.34 8-3v-.5c-1.7 1.3-4.7 2-8 2s-6.3-.7-8-2Z";

const stacks: StackItem[] = [
  { name: "C", path: siC.path, tone: "grass" },
  { name: "C++", path: siCplusplus.path, tone: "grass" },
  { name: "数据库", path: DATABASE_PATH, tone: "grass" },
  { name: "网易云音乐", path: siNeteasecloudmusic.path, tone: "pivot" },
  { name: "Linux", path: siLinux.path, tone: "peach" },
  { name: "Git", path: siGit.path, tone: "peach" },
  { name: "GitHub", path: siGithub.path, tone: "peach" },
];

const toneClass = {
  grass: "fill-grass",
  peach: "fill-peach",
  pivot: "fill-[#ec4141]",
};

export function StackStrip() {
  return (
    <div className="mx-auto mt-2 max-w-3xl">
      <ul
        aria-label="常用的语言和工具"
        className="flex flex-wrap items-center justify-center gap-x-12 gap-y-7"
      >
        {stacks.map((item, index) => (
          <li
            key={item.name}
            title={item.name}
            className="relative transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            <svg
              role="img"
              aria-label={item.name}
              viewBox="0 0 24 24"
              className={`${styles.logo} h-10 w-10 sm:h-11 sm:w-11 ${toneClass[item.tone]}`}
              style={{ "--d": `${index * 0.07}s` } as CSSProperties}
            >
              <path d={item.path} />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
