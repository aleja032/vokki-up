'use client';

import { Folder, Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PixelLabel } from './pixel-label';
import { SearchField } from './search-field';
import './folder-list.css';

export type FolderListItem = {
  id: string;
  label: string;
  count: number;
  /** Long form of the count shown on the phone folder cards ("46 tarjetas"). */
  countLabel?: string;
  /** Short due label of the phone folder cards ("12 hoy"); hidden when absent. */
  dueLabel?: string;
  /** The selected folder is the one whose content is shown. */
  pressed: boolean;
  ariaLabel?: string;
  onSelect: () => void;
};

type FolderListProps = {
  title: string;
  /** Number shown next to the title (how many folders exist). */
  total: number;
  /** Accessible name of the list of folders. */
  listLabel: string;
  searchLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  items: readonly FolderListItem[];
  emptyLabel: string;
  /** Show the empty message (defaults to "there are no items"). */
  isEmpty?: boolean;
  addLabel: string;
  onAdd: () => void;
  /** Phones: the link that opens the whole list of folders ("Ver las 12"). */
  expandLabel?: string;
  /** Phones: the link that goes back to the scrolling row. */
  collapseLabel?: string;
  className?: string;
};

// Folder navigator: a searchable side list on wide screens; on phones a row of
// folder cards that a link expands into a two-column list. One folder is
// selected at a time; the dashed button adds a folder.
export function FolderList({
  title,
  total,
  listLabel,
  searchLabel,
  searchValue,
  onSearchChange,
  items,
  emptyLabel,
  isEmpty = items.length === 0,
  addLabel,
  onAdd,
  expandLabel,
  collapseLabel,
  className
}: FolderListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = expandLabel !== undefined && collapseLabel !== undefined;

  return (
    <aside
      aria-labelledby="folder-list-title"
      className={cn('folder-list', className)}
      data-expanded={isExpanded}
    >
      <div className="folder-list__head">
        <h2 id="folder-list-title">{title}</h2>
        <span className="folder-list__total">{total}</span>
        {canExpand ? (
          <button
            aria-expanded={isExpanded}
            className="folder-list__toggle"
            onClick={() => setIsExpanded(current => !current)}
            type="button"
          >
            {isExpanded ? collapseLabel : expandLabel}
          </button>
        ) : null}
      </div>
      <SearchField
        className="folder-list__search"
        id="folder-list-search"
        label={searchLabel}
        onChange={onSearchChange}
        placeholder={searchLabel}
        shape="soft"
        value={searchValue}
      />
      <div className="folder-list__rail">
        <div className="folder-list__scroller">
          <nav aria-label={listLabel} className="folder-list__nav">
            {items.map(item => (
              <button
                aria-label={item.ariaLabel}
                aria-pressed={item.pressed}
                className="folder-list__item"
                key={item.id}
                onClick={item.onSelect}
                type="button"
              >
                <Folder
                  aria-hidden="true"
                  className="folder-list__icon"
                  size={20}
                />
                <span className="folder-list__text">
                  <span className="folder-list__label">{item.label}</span>
                  <span className="folder-list__count">{item.count}</span>
                  <span className="folder-list__count-long">
                    {item.countLabel ?? item.count}
                  </span>
                </span>
                {item.dueLabel ? (
                  <span className="folder-list__due">
                    <span aria-hidden="true" className="folder-list__dot" />
                    <PixelLabel>{item.dueLabel}</PixelLabel>
                  </span>
                ) : null}
              </button>
            ))}
            {isEmpty ? (
              <p className="folder-list__empty">{emptyLabel}</p>
            ) : null}
          </nav>
        </div>
        <button className="folder-list__add" onClick={onAdd} type="button">
          <Plus aria-hidden="true" size={18} strokeWidth={2.6} />
          <span className="folder-list__add-label">{addLabel}</span>
        </button>
      </div>
    </aside>
  );
}
