import ReactMarkdown from 'react-markdown';
import { ABOUT_TEXT } from '@/lib/constants/text';

export default function AboutPage() {
  return (
    <main className="flex justify-center px-6 py-4 md:px-12 md:py-8">
      <div
        className="w-180 rounded border border-[color:var(--border)] p-6 md:p-12"
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--foreground)',
          borderColor: 'var(--surface-contrast)',
        }}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{ABOUT_TEXT}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
