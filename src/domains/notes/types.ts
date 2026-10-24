export type NoteCategory = string;

export type Note = {
  id: string;
  title: string;
  category: NoteCategory;
  body: string;
  updatedAt: string;
  favorite?: boolean;
};

export type NoteFilter = 'Todas' | 'Favoritas' | NoteCategory;
