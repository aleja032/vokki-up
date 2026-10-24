'use client';

import { useState } from 'react';
import { aiMessages } from '../messages';

const messages = aiMessages.serviceError;

type AiSupportIdProps = {
  supportId: string;
};

export function AiSupportId({ supportId }: AiSupportIdProps) {
  // UI-only toggle: the label flips to "copiado"; nothing is written to the clipboard yet.
  const [isCopied, setIsCopied] = useState(false);

  return (
    <button
      className="aicap-support"
      type="button"
      onClick={() => setIsCopied(true)}
    >
      <span>{supportId} ·</span>
      <span>{isCopied ? messages.copied : messages.copy}</span>
    </button>
  );
}
