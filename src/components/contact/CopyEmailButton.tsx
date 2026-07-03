"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { CopyIcon, CheckIcon } from "@/components/icons";

type Props = {
  email: string;
};

export function CopyEmailButton({ email }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时静默降级：mailto 链接仍然可点
      setCopied(false);
    }
  };

  return (
    <Button
      variant="tertiary"
      size="sm"
      onPress={handleCopy}
      aria-label={copied ? "邮箱已复制" : "复制邮箱地址"}
      className="rounded-full font-mono text-xs"
    >
      {copied ? (
        <>
          <CheckIcon className="size-3.5 text-grass-deep" />
          已复制
        </>
      ) : (
        <>
          <CopyIcon className="size-3.5" />
          复制
        </>
      )}
    </Button>
  );
}
