/** Pixel art of each world, shared by the home row and the Mundos screens. */
export const WORLD_IMAGES = {
  daily: '/images/world-park-day.png',
  work: '/images/world-work-day.png',
  travel: '/images/world-travel-day.png',
  phrases: '/images/world-phrases-day.png'
} as const;

export type WorldImageId = keyof typeof WORLD_IMAGES;
