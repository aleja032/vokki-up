export type ReviewExit = {
  href: string;
  target: 'cards' | 'home';
};

export function resolveReviewExit(from: string | null): ReviewExit {
  return from === 'cards'
    ? { href: '/cards', target: 'cards' }
    : { href: '/', target: 'home' };
}
