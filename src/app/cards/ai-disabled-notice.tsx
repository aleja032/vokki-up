import Link from 'next/link';
import { addHubMessages } from './add-hub-messages';
import './ai-disabled-notice.css';

const messages = addHubMessages.aiDisabled;

/** Shown wherever AI capture is unavailable because Settings turned it off. */
export function AiDisabledNotice({ title }: { title?: boolean }) {
  return (
    <div className="ai-disabled-notice" role="status">
      {title && <strong>{messages.title}</strong>}
      <p>{messages.body}</p>
      <Link href="/settings">{messages.settingsLink}</Link>
    </div>
  );
}
