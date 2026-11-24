// Daytime "Frases utiles" world art: Noma chatting under pixel speech bubbles (procedural pixel art).
// Usage: node scripts/generate-world-phrases-day.mjs
import {
  H,
  W,
  P,
  bayer,
  cloud,
  createCanvas,
  inCircle,
  inRound,
  makeRnd,
  paintSky,
  placeNoma,
  writeScaled
} from './lib/pixel-art.mjs';

const c = createCanvas();
const { set, rect, shape } = c;
const rnd = makeRnd(11);
const HORIZON = 56;

// ---- sky, sun, clouds ----
paintSky(c, HORIZON + 14);
shape((x, y) => inCircle(x, y, 108, 12, 9), P.sunHi);
shape((x, y) => inCircle(x, y, 108, 12, 6), P.sun);
cloud(c, 22, 48, 0.6);
cloud(c, 196, 14, 0.6);
cloud(c, 148, 56, 0.5);

// ---- hills + ground ----
const farY = x => HORIZON - 6 - 5 * Math.sin(x / 22 + 1) - 3 * Math.sin(x / 9);
const midY = x =>
  HORIZON + 1 - 4 * Math.sin(x / 30 + 3) - 1.5 * Math.sin(x / 11);
shape((x, y) => y >= farY(x), P.hillFar);
shape((x, y) => y >= midY(x), P.hillMid);
shape((x, y) => y >= HORIZON + 6, P.grass);
for (let y = HORIZON + 6; y < H; y++)
  for (let x = 0; x < W; x++) {
    if (c.get(x, y) === P.grass && (x * 7 + y * 3) % 19 === 0 && y % 7 === 3) {
      set(x, y, P.grassDk);
      set(x + 1, y - 1, P.grassDk);
    }
    if (y > 84 && c.get(x, y) === P.grass && bayer(x, y) < (y - 84) / 40)
      set(x, y, P.grassDk);
  }

// ---- Noma (center), with ground shadow ----
const NX = 80,
  NY = 28,
  NH = 52;
shape(
  (x, y) => ((x - 108) / 17) ** 2 + ((y - (NY + NH + 3)) / 3) ** 2 <= 1,
  P.grassDk
);
shape(
  (x, y) => ((x - 108) / 10) ** 2 + ((y - (NY + NH + 3)) / 1.8) ** 2 <= 1,
  P.grassSh
);
const noma = placeNoma(c, { x: NX, y: NY, h: NH });
noma.draw();

// ---- speech bubbles (shapes + glyph-free marks) ----
function bubble({ x, y, w, h, fill, shade, tail, marks }) {
  const mask = (px, py) => inRound(px, py, x, y, w, h, 5);
  shape(mask, fill);
  // lower shade strip + highlight
  for (let py = y + h - 3; py < y + h; py++)
    for (let px = x; px < x + w; px++) if (mask(px, py)) set(px, py, shade);
  // tail: a small triangle pointing toward Noma
  const [tx, ty, dir] = tail; // base x, base y (bottom edge), direction -1/1 in x
  const widths = [6, 5, 4, 3, 2, 1];
  const tm = new Set();
  widths.forEach((wd, i) => {
    for (let k = 0; k < wd; k++)
      tm.add(`${tx + dir * (k + Math.floor(i / 2))},${ty + i}`);
  });
  const full = (px, py) => mask(px, py) || tm.has(`${px},${py}`);
  tm.forEach(key => {
    const [px, py] = key.split(',').map(Number);
    set(px, py, fill);
  });
  c.outline(full);
  // inner marks
  marks(x, y, w, h);
}
const dots = (x, y, w, h) => {
  const cy = y + Math.floor(h / 2) - 1;
  [-6, 0, 6].forEach(dx =>
    rect(x + Math.floor(w / 2) + dx - 1, cy, 3, 3, P.brand)
  );
};
const lines = rows => (x, y) =>
  rows.forEach(([ox, oy, len, col]) => rect(x + ox, y + oy, len, 2, col));

bubble({
  x: 14,
  y: 12,
  w: 50,
  h: 26,
  fill: P.white,
  shade: P.cloudSh,
  tail: [54, 38, -1],
  marks: dots
});
bubble({
  x: 140,
  y: 8,
  w: 56,
  h: 30,
  fill: P.lav,
  shade: P.lav2,
  tail: [146, 38, 1],
  marks: lines([
    [6, 7, 36, P.white],
    [6, 13, 44, P.white],
    [6, 19, 24, P.brand]
  ])
});
bubble({
  x: 150,
  y: 46,
  w: 40,
  h: 20,
  fill: P.hillFar,
  shade: P.hillMid,
  tail: [158, 66, 1],
  marks: (x, y) => {
    // check mark + short line
    [
      [6, 9],
      [7, 10],
      [8, 11],
      [9, 10],
      [10, 9],
      [11, 8],
      [12, 7]
    ].forEach(([dx, dy]) => rect(x + dx, y + dy - 1, 2, 2, P.ink));
    rect(x + 18, y + 6, 14, 2, P.white);
    rect(x + 18, y + 11, 9, 2, P.white);
  }
});

// ---- flowers, kept off Noma ----
const cols = [P.brand, P.lav, P.white, P.lav2];
let placed = 0,
  guard = 0;
while (placed < 26 && guard++ < 2000) {
  const x = 4 + Math.floor(rnd() * (W - 8));
  const y = HORIZON + 12 + Math.floor(rnd() * 30);
  if (x > 70 && x < 148 && y < 90) continue;
  const col = cols[placed % cols.length];
  if (placed % 3 === 0) {
    set(x, y - 1, col);
    set(x - 1, y, col);
    set(x + 1, y, col);
    set(x, y + 1, col);
    set(x, y, P.sun);
  } else {
    set(x, y, col);
    set(x + 1, y, col);
    set(x, y + 1, P.grassDk);
  }
  placed++;
}

// ---- sparkles ----
c.sparkle(76, 44, 2, P.white);
c.sparkle(142, 70, 2, P.white);
c.sparkle(30, 70, 1, P.lav);
c.sparkle(124, 28, 2, P.white);
c.sparkle(190, 84, 2, P.sunHi);

writeScaled(c, 'public/images/world-phrases-day.png', P.sky3);
