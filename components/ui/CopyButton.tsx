import { Copy as CopyIcon } from 'lucide-react';
import { Check as CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { buttonClasses } from '@/lib/styles/sharedStyles';

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
      <button className={buttonClasses} onClick={handleCopy}>
        {!copied ? <CopyIcon size={16} /> : <CheckIcon size={16} />}
      </button>
    </div>
  );
}
