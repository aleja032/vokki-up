import { aiMessages } from '../messages';

const messages = aiMessages.panes;

type AiPaneGroupsProps = {
  groups: Array<{ id: string; name: string; tone?: string }>;
  selectedGroupId: string;
  onChange: (groupId: string) => void;
};

/** Group picker (chips) shared by the image and word-list panes. */
export function AiPaneGroups({
  groups,
  selectedGroupId,
  onChange
}: AiPaneGroupsProps) {
  return (
    <fieldset className="aipane-groups">
      <legend>{messages.groupLegend}</legend>
      <div className="aipane-groups__options">
        {groups.map(group => (
          <button
            className="aipane-chip"
            data-tone={group.tone}
            type="button"
            key={group.id}
            title={group.name}
            aria-pressed={group.id === selectedGroupId}
            onClick={() => onChange(group.id)}
          >
            <span aria-hidden="true" />
            <span className="aipane-chip__label">{group.name}</span>
          </button>
        ))}
      </div>
      <span className="aipane-groups__hint">{messages.groupHint}</span>
    </fieldset>
  );
}
