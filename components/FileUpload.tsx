"use client";

import { extractTextFromPDF } from "@/lib/extractPdfText";

interface FileUploadProps {
  onLoad: (text: string) => void;
}

export default function FileUpload({ onLoad }: FileUploadProps) {
  // className="h-9 rounded px-6 py-2 text-sm font-medium"
  return (
    <label className="inline-block h-9 cursor-pointer rounded bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700">
      Upload file
      <input
        type="file"
        accept=".txt,.pdf"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          try {
            const isPdf = file.name.toLowerCase().endsWith(".pdf");
            const text = isPdf
              ? await extractTextFromPDF(file)
              : await file.text();

            onLoad(text);
          } catch (err) {
            console.error("File read error:", err);
            alert("Failed to read file.");
          }
        }}
      />
    </label>
  );
}
