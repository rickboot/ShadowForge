'use client';

import { extractTextFromPDF } from '@/lib/extractPdfText';

interface FileUploadProps {
  onLoad: (text: string) => void;
}

export default function FileUpload({ onLoad }: FileUploadProps) {
  return (
    <label className='inline-block px-4 py-2 bg-cyan-600 text-white rounded cursor-pointer hover:bg-cyan-700'>
      Upload file
      <input
        type='file'
        accept='.txt,.pdf'
        className='hidden'
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          try {
            const isPdf = file.name.toLowerCase().endsWith('.pdf');
            const text = isPdf
              ? await extractTextFromPDF(file)
              : await file.text();

            onLoad(text);
          } catch (err) {
            console.error('File read error:', err);
            alert('Failed to read file.');
          }
        }}
      />
    </label>
  );
}
