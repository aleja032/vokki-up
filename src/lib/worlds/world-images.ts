/** Pixel art of each world, shared by the home row and the Mundos screens. */
export const WORLD_IMAGES = {
  daily: '/images/world-cafe-day.png',
  work: '/images/world-work.svg',
  travel: '/images/world-travel.svg',
  phrases: '/images/world-phrases.svg'
} as const;

export type WorldImageId = keyof typeof WORLD_IMAGES;
