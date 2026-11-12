'use client';

import { ImageUp, ListChecks, PencilLine } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import {
  ADD_HUB_MODES,
  getSelectableHubModes,
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

type AddHubModeTabsProps = {
  mode: AddHubMode;
  isAiEnabled: boolean;
  onSelect: (mode: AddHubMode) => void;
};

/** Three-option selector: tabs with icon, short label and one-line description. */
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
        const isDisabled = !selectable.includes(item);
        return (
          <button
            className="addhub__mode"
            type="button"
            role="tab"
            key={item}
            id={addHubTabId(item)}
            aria-selected={isSelected}
            aria-controls={addHubPanelId(item)}
            tabIndex={isSelected ? 0 : -1}
            disabled={isDisabled}
            title={isDisabled ? messages.aiDisabled.tabHint : undefined}
            onClick={() => onSelect(item)}
          >
            <span className="addhub__mode-icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <span className="addhub__mode-copy">
              <strong title={messages.modes[item].label}>
                {messages.modes[item].label}
                {item !== 'manual' && (
                  <span className="addhub__badge">{messages.badge}</span>
                )}
              </strong>
              <span title={messages.modes[item].hint}>
                {messages.modes[item].hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
