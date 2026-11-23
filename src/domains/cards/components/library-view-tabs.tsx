import { SegmentedToggle } from '@/components/ui/segmented-toggle';
import { wordLibraryMessages } from '../word-library/messages';

const messages = wordLibraryMessages;

export type LibraryView = 'worlds' | 'library';

type LibraryViewTabsProps = { view: LibraryView };

// The two ways into the same catalog: themed worlds, or one searchable list.
export function LibraryViewTabs({ view }: LibraryViewTabsProps) {
  return (
    <SegmentedToggle<LibraryView>
      ariaLabel={messages.viewTabsLabel}
      className="library-view-tabs"
      options={[
        {
          value: 'worlds',
          label: messages.tabWorlds,
          href: '/cards/word-library'
        },
        {
          value: 'library',
          label: messages.tabLibrary,
          href: '/cards/word-library?world=all'
        }
      ]}
      value={view}
    />
  );
}
