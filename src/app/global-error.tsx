'use client';

import { statusPageMessages } from '@/config/messages';

const messages = statusPageMessages.globalError;

// Self-contained: the root layout (and its CSS and fonts) is not rendered here.
const globalErrorStyles = `
  :root { color-scheme: light dark; --ground: #f7f4ee; --surface: #ffffff; --line: #e2ddd3; --ink: #1b1a2e; --ink-soft: #5b5870; --indigo: #4a3ac9; --indigo-soft: #e9e6fb; --on-indigo: #ffffff; }
  @media (prefers-color-scheme: dark) { :root { --ground: #141416; --surface: #1d1d21; --line: #33333a; --ink: #edebe6; --ink-soft: #a6a3ad; --indigo: #9a91f5; --indigo-soft: #302d4c; --on-indigo: #141416; } }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: var(--ground); color: var(--ink); font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; line-height: 1.5; }
  .ge { width: 100%; max-width: 480px; display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; }
  .ge-art { position: relative; width: 168px; height: 128px; }
  .ge-card { position: absolute; width: 120px; height: 96px; border-radius: 18px; }
  .ge-card-back { left: 6px; top: 14px; background: var(--indigo-soft); transform: rotate(-8deg); }
  .ge-card-front { left: 40px; top: 4px; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--line); background: var(--surface); color: var(--indigo); font: 600 38px Georgia, serif; transform: rotate(5deg); }
  .ge-eyebrow { margin: 0; color: var(--ink-soft); font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .ge-title { margin: 0; max-width: 100%; overflow-wrap: anywhere; font: 600 34px/1.1 Georgia, serif; }
  .ge-text { margin: 0; max-width: 100%; overflow-wrap: anywhere; color: var(--ink-soft); font-size: 16px; }
  .ge-button { height: 52px; margin-top: 8px; padding: 0 28px; border: 0; border-radius: 14px; background: var(--indigo); color: var(--on-indigo); font: 700 16px system-ui, sans-serif; cursor: pointer; }
  .ge-button:focus-visible { outline: 3px solid var(--indigo); outline-offset: 3px; }
`;

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body>
        <style>{globalErrorStyles}</style>
        <main className="ge">
          <div aria-hidden="true" className="ge-art">
            <span className="ge-card ge-card-back" />
            <span className="ge-card ge-card-front">!</span>
          </div>
          <p className="ge-eyebrow">{messages.eyebrow}</p>
          <h1 className="ge-title">{messages.title}</h1>
          <p className="ge-text">{messages.description}</p>
          <button className="ge-button" onClick={reset} type="button">
            {messages.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
