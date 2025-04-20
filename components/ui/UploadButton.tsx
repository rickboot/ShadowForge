'use client';

import { Upload as UploadIcon } from 'lucide-react';
import { extractTextFromPDF } from '@/lib/extractPdfText';
import { useRef } from 'react';
import { buttonClasses } from '@/lib/sharedStyles';

interface UploadButtonProps {
  onLoad: (text: string) => void;
}

export default function UploadButton({ onLoad }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      const text = isPdf ? await extractTextFromPDF(file) : await file.text();
      onLoad(text);
    } catch (err) {
      console.error('File read error:', err);
      alert('Failed to read file.');
    }
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={buttonClasses}>
        <UploadIcon size={16} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.pdf"
        onChange={handleChange}
        className="hidden"
      />
    </>
  );
}
