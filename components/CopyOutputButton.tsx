import { Copy as CopyIcon } from 'lucide-react';
import { useState } from 'react';

interface CopyOutputButtonProps {
  text: string;
}

export default function CopyOutputButton({ text }: CopyOutputButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div>
      <button className='text-white' onClick={handleCopy}>
        {!copied ? <CopyIcon size={16} /> : 'copied!'}
      </button>
    </div>
  );
}
