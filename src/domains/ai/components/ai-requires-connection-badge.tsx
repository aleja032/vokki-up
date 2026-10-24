import { aiMessages } from '../messages';
import './ai-capture.css';

const messages = aiMessages.badge;

export function AiRequiresConnectionBadge() {
  return (
    <span className="aicap-badge">
      <strong>{messages.label}</strong>
      {messages.text}
    </span>
  );
}
