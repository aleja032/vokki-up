export function isCurrentRoute(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  if (href === '/cards') {
    return pathname.startsWith('/cards') || pathname.startsWith('/review');
  }

  return pathname.startsWith(href);
}
