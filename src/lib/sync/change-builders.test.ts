import { describe, expect, it } from 'vitest';
import {
  collectionChangeBuilder,
  scalarChangeBuilder
} from './change-builders';

describe('sync change builders', () => {
  it('queues only changed collection records and removed records', () => {
    const changes = collectionChangeBuilder<{ id: string; title: string }>(
      'note'
    )(
      [
        { id: 'same', title: 'Unchanged' },
        { id: 'edit', title: 'Before' },
        { id: 'remove', title: 'Removed' }
      ],
      [
        { id: 'same', title: 'Unchanged' },
        { id: 'edit', title: 'After' },
        { id: 'new', title: 'Added' }
      ]
    );

    expect(changes).toEqual([
      {
        entityType: 'note',
        operation: 'upsert',
        entityId: 'edit',
        payload: { id: 'edit', title: 'After' }
      },
      {
        entityType: 'note',
        operation: 'upsert',
        entityId: 'new',
        payload: { id: 'new', title: 'Added' }
      },
      { entityType: 'note', operation: 'delete', entityId: 'remove' }
    ]);
  });

  it('uses stable entity IDs for changed scalar preferences', () => {
    expect(
      scalarChangeBuilder('settings', 'settings/theme')('light', 'dark')
    ).toEqual([
      {
        entityType: 'settings',
        operation: 'upsert',
        entityId: 'settings/theme',
        payload: { value: 'dark' }
      }
    ]);
  });
});
