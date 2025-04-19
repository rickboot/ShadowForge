"use client";

import { Download as DownloadIcon } from "lucide-react";
import { buttonClasses } from "@/lib/styles";

interface DownloadOutputProps {
  content: string;
  filename: string;
}

export default function DownloadOutput({
  content,
  filename = "shadowforge-export.md",
}: DownloadOutputProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className={buttonClasses} onClick={handleDownload}>
      <DownloadIcon size={16} />
    </button>
  );
}
