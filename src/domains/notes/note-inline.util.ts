export type InlineMark = 'bold' | 'italic' | 'underline';

export type InlineNode =
  | { type: 'text'; text: string }
  | { type: InlineMark; children: InlineNode[] };

export type TextEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

// Inline marks are stored as plain text: **bold**, _italic_ and ++underline++.
// Underscores only open or close italics at word boundaries so snake_case
// words and URLs stay untouched, and every mark needs non-space content next to
// its delimiters so stray "**" or "++" remain literal text.
export const INLINE_MARKERS: Record<InlineMark, string> = {
  bold: '**',
  italic: '_',
  underline: '++'
};

const INLINE_PATTERN =
  /\*\*(?=\S)([\s\S]+?)(?<=\S)\*\*|\+\+(?=\S)([\s\S]+?)(?<=\S)\+\+|(?<![\p{L}\p{N}_])_(?=\S)([\s\S]+?)(?<=\S)_(?![\p{L}\p{N}_])/gu;

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(INLINE_PATTERN)) {
    if (match.index > cursor) {
      nodes.push({ type: 'text', text: text.slice(cursor, match.index) });
    }
    const [, bold, underline, italic] = match;
    if (bold !== undefined) {
      nodes.push({ type: 'bold', children: parseInline(bold) });
    } else if (underline !== undefined) {
      nodes.push({ type: 'underline', children: parseInline(underline) });
    } else {
      nodes.push({ type: 'italic', children: parseInline(italic) });
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) {
    nodes.push({ type: 'text', text: text.slice(cursor) });
  }
  return nodes;
}

function flattenInline(nodes: InlineNode[]): string {
  return nodes
    .map(node =>
      node.type === 'text' ? node.text : flattenInline(node.children)
    )
    .join('');
}

export function stripInlineMarks(text: string): string {
  return flattenInline(parseInline(text));
}

export function toggleInlineMark(
  value: string,
  start: number,
  end: number,
  mark: InlineMark
): TextEdit {
  const token = INLINE_MARKERS[mark];
  const size = token.length;
  const selected = value.slice(start, end);

  // Markers surround the selection: remove them.
  if (
    value.slice(start - size, start) === token &&
    value.slice(end, end + size) === token
  ) {
    return {
      value: value.slice(0, start - size) + selected + value.slice(end + size),
      selectionStart: start - size,
      selectionEnd: end - size
    };
  }

  // The selection includes its own markers: remove them.
  if (
    selected.length >= size * 2 &&
    selected.startsWith(token) &&
    selected.endsWith(token)
  ) {
    return {
      value:
        value.slice(0, start) +
        selected.slice(size, selected.length - size) +
        value.slice(end),
      selectionStart: start,
      selectionEnd: end - size * 2
    };
  }

  return {
    value: value.slice(0, start) + token + selected + token + value.slice(end),
    selectionStart: start + size,
    selectionEnd: end + size
  };
}

const BULLET = '- ';
const BULLET_PREFIX = /^(?:- |• )/;

export function toggleBulletList(
  value: string,
  start: number,
  end: number
): TextEdit {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const newline = value.indexOf('\n', end);
  const lineEnd = newline === -1 ? value.length : newline;
  const lines = value.slice(lineStart, lineEnd).split('\n');
  const isSingle = lines.length === 1;
  const editable = lines.filter(line => isSingle || line.trim() !== '');
  const allBullets = editable.every(line => BULLET_PREFIX.test(line));

  let firstDelta = 0;
  let totalDelta = 0;
  const edited = lines.map((line, index) => {
    if (!isSingle && line.trim() === '') return line;
    let next = line;
    if (allBullets) {
      next = line.replace(BULLET_PREFIX, '');
    } else if (!BULLET_PREFIX.test(line)) {
      next = BULLET + line;
    }
    const delta = next.length - line.length;
    if (index === 0) firstDelta = delta;
    totalDelta += delta;
    return next;
  });

  return {
    value: value.slice(0, lineStart) + edited.join('\n') + value.slice(lineEnd),
    selectionStart:
      start === lineStart ? start : Math.max(lineStart, start + firstDelta),
    selectionEnd: Math.max(lineStart, end + totalDelta)
  };
}
