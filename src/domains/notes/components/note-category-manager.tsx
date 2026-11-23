'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActionPill } from '@/components/ui/action-pill';
import { translateText } from '@/lib/i18n/locale';
import { notesMessages } from '../messages';
import {
  createNoteCategorySchema,
  type NoteCategoryInput
} from '../note.schema';
import './note-category-manager.css';

const messages = notesMessages.page.categories;

type NoteCategoryManagerProps = {
  categories: string[];
  onCreate: (name: string) => void;
  onRename: (previousName: string, nextName: string) => void;
  onDelete: (name: string) => void;
};

// Link-style toggle that opens the panel to create, rename and delete
// categories. The notes of a deleted category move to General.
export function NoteCategoryManager({
  categories,
  onCreate,
  onRename,
  onDelete
}: NoteCategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<NoteCategoryInput>({
    resolver: zodResolver(
      createNoteCategorySchema(categories, editingCategory)
    ),
    defaultValues: { name: '' }
  });

  function submit({ name }: NoteCategoryInput) {
    if (editingCategory) {
      onRename(editingCategory, name);
    } else {
      onCreate(name);
    }
    setEditingCategory(null);
    reset({ name: '' });
  }

  function startEditing(category: string) {
    setEditingCategory(category);
    setValue('name', category);
  }

  function cancelEditing() {
    setEditingCategory(null);
    reset({ name: '' });
  }

  return (
    <section aria-label={messages.label} className="note-categories">
      <button
        aria-expanded={isOpen}
        className="note-categories__toggle"
        onClick={() => setIsOpen(current => !current)}
        type="button"
      >
        {isOpen ? messages.hide : messages.manage}
      </button>
      {isOpen && (
        <div className="note-categories__panel">
          <form
            className="note-categories__form"
            onSubmit={handleSubmit(submit)}
          >
            <label htmlFor="note-category-name">
              {editingCategory ? messages.renameLabel : messages.createLabel}
            </label>
            <div className="note-categories__field">
              <input
                id="note-category-name"
                maxLength={40}
                {...register('name')}
              />
              <ActionPill size="sm" type="submit" variant="secondary">
                {editingCategory ? messages.save : messages.create}
              </ActionPill>
              {editingCategory && (
                <ActionPill onClick={cancelEditing} size="sm">
                  {messages.cancel}
                </ActionPill>
              )}
            </div>
            {errors.name?.message && (
              <p className="note-categories__error" role="alert">
                {errors.name.message}
              </p>
            )}
          </form>
          <p className="note-categories__hint">{messages.deletionNote}</p>
          <ul className="note-categories__list">
            {categories.map(category => (
              <li key={category}>
                <span>{translateText(category)}</span>
                {category === 'General' ? (
                  <span className="note-categories__default">
                    {messages.defaultLabel}
                  </span>
                ) : (
                  <span className="note-categories__actions">
                    <button
                      className="note-categories__link"
                      onClick={() => startEditing(category)}
                      type="button"
                    >
                      {messages.rename}
                    </button>
                    <button
                      className="note-categories__link"
                      onClick={() => {
                        onDelete(category);
                        if (editingCategory === category) cancelEditing();
                      }}
                      type="button"
                    >
                      {messages.delete}
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
