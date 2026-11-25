import { OTHERS_GROUP, isOthers } from './delete-group';
import { displayTone, type FolderColor } from './group-colors';
import { getGroupDisplayName } from './group-display';
import { createGroupEditSchema } from './group-edit.schema';
import type { CardGroup } from './types';

/** What the user can change of a folder. Absent fields stay as they are. */
export type GroupPatch = { name?: string; tone?: FolderColor };

// "Otros" is reserved for the catch-all group, in both languages.
const RESERVED_NAMES = [OTHERS_GROUP.name, 'Others'];

/**
 * Names a folder cannot take: the stored and the displayed name of every other
 * folder (seed folders show a translated name) plus the reserved "Otros".
 */
export function collectOtherGroupNames(
  groups: readonly CardGroup[],
  groupId: string
) {
  const others = groups.filter(group => group.id !== groupId);
  return [
    ...others.flatMap(group => [group.name, getGroupDisplayName(group)]),
    ...RESERVED_NAMES
  ];
}

/**
 * Reduces what the form submitted to what really changed. A name equal to the
 * displayed one is not sent (a seed folder keeps its stored Spanish name), and
 * a color equal to the displayed one is not sent (a legacy amber or coral stays
 * stored until the user picks another color).
 */
export function buildGroupPatch(
  group: CardGroup,
  values: { name: string; tone: FolderColor }
): GroupPatch {
  const patch: GroupPatch = {};
  const name = values.name.trim();
  if (name !== getGroupDisplayName(group)) patch.name = name;
  if (values.tone !== displayTone(group.tone)) patch.tone = values.tone;
  return patch;
}

/**
 * Applies a rename and/or recolor to one folder. Rules (revalidated here, not
 * only in the form): the name is trimmed, non-empty, at most 30 characters and
 * not taken by another folder (case-insensitive); "Otros" keeps its name, since
 * the delete rule and the catch-all lookup rely on it, but can be recolored.
 * Unknown ids, empty patches and rejected values return the same list.
 */
export function updateGroupDetails(
  groups: CardGroup[],
  groupId: string,
  patch: GroupPatch
): CardGroup[] {
  const target = groups.find(group => group.id === groupId);
  if (!target) return groups;

  const canRename = !isOthers(target);
  let next: CardGroup = target;

  if (patch.name !== undefined && canRename) {
    const parsed = createGroupEditSchema(
      collectOtherGroupNames(groups, groupId)
    ).safeParse({
      name: patch.name,
      tone: patch.tone ?? displayTone(target.tone)
    });
    if (!parsed.success) return groups;
    if (parsed.data.name !== target.name)
      next = { ...next, name: parsed.data.name };
  }
  if (patch.tone !== undefined && patch.tone !== target.tone)
    next = { ...next, tone: patch.tone };

  if (next === target) return groups;
  return groups.map(group => (group.id === groupId ? next : group));
}
