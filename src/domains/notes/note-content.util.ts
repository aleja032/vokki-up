export type NoteBlock =
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string };

const HEADING_PREFIX = /^##\s+/;
const BULLET_PREFIX = /^(?:[-•]\s+)/;

// Notes are stored as plain text. Lines starting with "## " are section
// headings and lines starting with "- " or "•" are list items; everything else
// is a paragraph. Unformatted notes simply render as paragraphs.
export function parseNoteBody(body: string): NoteBlock[] {
  const blocks: NoteBlock[] = [];
  let paragraph: string[] = [];

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
      paragraph = [];
    }
  }

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
    } else if (HEADING_PREFIX.test(line)) {
      flushParagraph();
      blocks.push({ type: 'heading', text: line.replace(HEADING_PREFIX, '') });
    } else if (BULLET_PREFIX.test(line)) {
      flushParagraph();
      const item = line.replace(BULLET_PREFIX, '');
      const last = blocks[blocks.length - 1];
      if (last?.type === 'list') {
        last.items.push(item);
      } else {
        blocks.push({ type: 'list', items: [item] });
      }
    } else {
      paragraph.push(line);
    }
  }
  flushParagraph();
  return blocks;
}

export function getNotePreview(body: string): string {
  return parseNoteBody(body)
    .flatMap(block => {
      if (block.type === 'heading') return [];
      if (block.type === 'list') return block.items;
      return [block.text.replace(/\s+/g, ' ')];
    })
    .join(' · ');
}

export type NoteSection = {
  heading: string | null;
  blocks: Exclude<NoteBlock, { type: 'heading' }>[];
};

// Groups blocks under their heading so each section can be spaced as a unit.
export function groupNoteSections(body: string): NoteSection[] {
  const sections: NoteSection[] = [];
  for (const block of parseNoteBody(body)) {
    if (block.type === 'heading') {
      sections.push({ heading: block.text, blocks: [] });
      continue;
    }
    let current = sections[sections.length - 1];
    if (!current) {
      current = { heading: null, blocks: [] };
      sections.push(current);
    }
    current.blocks.push(block);
  }
  return sections;
}
