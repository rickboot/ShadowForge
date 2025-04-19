"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import FileUpload from "./FileUpload";
import CopyOutputButton from "./CopyOutputButton";

interface ShadowForgeLayoutProps {
  input: string;
  output: string;
  loading: boolean;
  normalize: boolean;
  setNormalize: (val: boolean) => void;
  setInput: (val: string) => void;
  handleConvert: () => void;
}

export default function ShadowForgeLayout({
  input,
  output,
  loading,
  normalize,
  setInput,
  setNormalize,
  handleConvert,
}: ShadowForgeLayoutProps) {
  const [previewMode, setPreviewMode] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    return (localStorage.getItem("theme") as "dark" | "light") || "light";
  });

  useEffect(() => {
    const htmlTag = document.documentElement;

    if (theme === "dark") {
      htmlTag.classList.add("dark");
    } else {
      htmlTag.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen font-sans">
      <header className="flex items-center justify-between border-b border-gray-300 px-6 py-4 dark:border-gray-700">
        <h1 className="font-serif text-2xl tracking-wide text-black dark:text-white">
          ShadowForge
        </h1>
        <button
          className="h-8 w-16 rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-gray-800"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "Dark" : "Light"}
        </button>
      </header>

      <main className="flex flex-col gap-6 px-6 py-8 lg:flex-row">
        {/* === input === */}
        <section className="flex-1 space-y-4">
          <h2 className="text-lg font-medium text-black dark:text-white">
            Input
          </h2>
          <textarea
            className="h-120 w-full resize-none rounded border border-gray-300 bg-white p-4 font-mono text-xs text-black dark:border-gray-700 dark:bg-black dark:text-white"
            placeholder="Paste your 5e content here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="mb-2 flex h-12 items-center justify-between gap-2">
            <button
              onClick={handleConvert}
              disabled={loading || !input.trim()}
              className="rounded bg-black px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {loading ? "Converting..." : "Convert"}
            </button>

            <FileUpload onLoad={setInput} />

            <label className="flex items-center space-x-2 text-sm dark:text-white">
              <span>Normalize text</span>
              <input
                type="checkbox"
                checked={normalize}
                onChange={(e) => setNormalize(e.target.checked)}
                className="form-checkbox accent-cyan-600"
              />
            </label>
          </div>
        </section>

        {/* === output === */}
        <section className="flex-1 space-y-4">
          <h2 className="text-lg font-medium text-black dark:text-white">
            Output
          </h2>
          <div className="h-120 w-full overflow-auto rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-black">
            {previewMode ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {output}
              </pre>
            )}
          </div>
          <CopyOutputButton text={output} />
          <div className="mb-2 flex h-12 items-center justify-end gap-2 dark:text-white">
            <label className="text-sm font-medium">Preview Mode</label>
            <input
              type="checkbox"
              checked={previewMode}
              onChange={() => setPreviewMode(!previewMode)}
              className="form-checkbox accent-cyan-600"
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        &copy; 2025 ShadowForge. Convert responsibly.
      </footer>
    </div>
  );
}
