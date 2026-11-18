'use client';

import { ImageUp, ListChecks, Lock, PencilLine } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import {
  ADD_HUB_MODES,
  getSelectableHubModes,
  isHubModeLocked,
  type AddHubMode
} from './add-hub-modes';
import { addHubMessages } from './add-hub-messages';

const messages = addHubMessages;

const MODE_ICONS = {
  image: ImageUp,
  words: ListChecks,
  manual: PencilLine
} as const;

export const addHubTabId = (mode: AddHubMode) => `addhub-tab-${mode}`;
export const addHubPanelId = (mode: AddHubMode) => `addhub-panel-${mode}`;
export const ADD_HUB_NOTICE_ID = 'addhub-ai-notice';

type AddHubModeTabsProps = {
  mode: AddHubMode;
  isAiEnabled: boolean;
  onSelect: (mode: AddHubMode) => void;
};

/**
 * Three-option selector: tabs with icon, short label and one-line description.
 * Locked AI modes stay visible with a lock; activating one explains why.
 */
export function AddHubModeTabs({
  mode,
  isAiEnabled,
  onSelect
}: AddHubModeTabsProps) {
  const selectable = getSelectableHubModes(isAiEnabled);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const index = selectable.indexOf(mode);
    const next =
      selectable[(index + step + selectable.length) % selectable.length];
    onSelect(next);
    document.getElementById(addHubTabId(next))?.focus();
  }

  function handleClick(item: AddHubMode) {
    if (!isHubModeLocked(item, isAiEnabled)) return onSelect(item);
    // A locked mode cannot open: bring the explanation and its links forward.
    const notice = document.getElementById(ADD_HUB_NOTICE_ID);
    notice?.scrollIntoView({ block: 'nearest' });
    notice?.focus();
  }

  return (
    <div
      className="addhub__modes"
      role="tablist"
      aria-label={messages.modesLabel}
      onKeyDown={handleKeyDown}
    >
      {ADD_HUB_MODES.map(item => {
        const Icon = MODE_ICONS[item];
        const isSelected = item === mode;
        const isLocked = isHubModeLocked(item, isAiEnabled);
        const hint = isLocked
          ? messages.aiDisabled.tabHint
          : messages.modes[item].hint;
        return (
          <button
            className="addhub__mode"
            type="button"
            role="tab"
            key={item}
            id={addHubTabId(item)}
            aria-selected={isSelected}
            aria-controls={addHubPanelId(item)}
            aria-disabled={isLocked || undefined}
            aria-describedby={isLocked ? ADD_HUB_NOTICE_ID : undefined}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleClick(item)}
          >
            <span className="addhub__mode-icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <span className="addhub__mode-copy">
              <strong title={messages.modes[item].label}>
                {messages.modes[item].label}
                {isLocked && (
                  <Lock
                    className="addhub__lock"
                    size={12}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                )}
                {!isLocked && item !== 'manual' && (
                  <span className="addhub__badge">{messages.badge}</span>
                )}
              </strong>
              <span title={hint}>{hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
