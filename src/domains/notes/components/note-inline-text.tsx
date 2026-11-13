import type { ReactNode } from 'react';
import { parseInline, type InlineNode } from '../note-inline.util';

function renderNodes(nodes: InlineNode[]): ReactNode[] {
  return nodes.map((node, index) => {
    if (node.type === 'text') return node.text;
    const children = renderNodes(node.children);
    if (node.type === 'bold') return <strong key={index}>{children}</strong>;
    if (node.type === 'italic') return <em key={index}>{children}</em>;
    return <u key={index}>{children}</u>;
  });
}

export function NoteInlineText({ text }: { text: string }) {
  return <>{renderNodes(parseInline(text))}</>;
}
