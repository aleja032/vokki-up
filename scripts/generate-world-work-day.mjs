// Daytime "Trabajo" world art: Noma at a coworking desk (procedural pixel art).
// Usage: node scripts/generate-world-work-day.mjs
import {
  H,
  W,
  P,
  bayer,
  cloud,
  createCanvas,
  hex,
  inCircle,
  placeNoma,
  writeScaled
} from './lib/pixel-art.mjs';

const c = createCanvas();
const { set, rect, shape, box } = c;
const wall = P.lavPale;
const wallLo = P.cloudSh;
const FLOOR = 84;

// ---- wall + floor ----
rect(0, 0, W, FLOOR, wall);
for (let y = 60; y < FLOOR; y++)
  for (let x = 0; x < W; x++)
    if (bayer(x, y) < (y - 60) / 40) set(x, y, wallLo);
rect(0, FLOOR, W, H - FLOOR, P.lav);
for (let y = FLOOR; y < H; y++)
  for (let x = 0; x < W; x++)
    if (
      (y - FLOOR) % 8 === 7 ||
      (x + Math.floor((y - FLOOR) / 8) * 17) % 34 === 0
    )
      set(x, y, P.lav2);
rect(0, FLOOR - 2, W, 2, P.woodHi); // baseboard
rect(0, FLOOR - 2, W, 1, P.white);

// ---- window with sky and skyline (left) ----
const WX = 8,
  WY = 8,
  WW = 66,
  WH = 52;
const bands = [P.sky1, P.sky2, P.sky3, P.sky4];
for (let y = WY; y < WY + WH; y++)
  for (let x = WX; x < WX + WW; x++) {
    const t = ((y - WY) / WH) * bands.length;
    const i = Math.min(3, Math.floor(t));
    const frac = t - i;
    const nx = Math.min(3, i + 1);
    set(
      x,
      y,
      frac > 0.75 && bayer(x, y) < (frac - 0.75) * 4 ? bands[nx] : bands[i]
    );
  }
shape((x, y) => inCircle(x, y, WX + 52, WY + 11, 6), P.sunHi);
shape((x, y) => inCircle(x, y, WX + 52, WY + 11, 4), P.sun);
cloud(c, WX + 18, WY + 14, 0.55);
// skyline: far (lavender) then near (violet) buildings
const bld = (x, w, top, col, winCol) => {
  rect(x, top, w, WY + WH - top, col);
  for (let wy = top + 3; wy < WY + WH - 4; wy += 4)
    for (let wx = x + 2; wx < x + w - 1; wx += 4) set(wx, wy, winCol);
};
[
  [WX + 2, 9, WY + 30],
  [WX + 12, 8, WY + 24],
  [WX + 21, 10, WY + 32],
  [WX + 32, 8, WY + 26],
  [WX + 41, 11, WY + 31],
  [WX + 53, 9, WY + 27]
].forEach(([x, w, t]) => bld(x, w, t, P.lav2, P.lav));
[
  [WX + 5, 11, WY + 36],
  [WX + 17, 9, WY + 32],
  [WX + 27, 12, WY + 38],
  [WX + 40, 9, WY + 34],
  [WX + 50, 14, WY + 37]
].forEach(([x, w, t]) => bld(x, w, t, P.deep, P.cream));
rect(WX, WY + WH - 4, WW, 4, P.grassDk); // street trees / park strip
// frame + mullions
box(WX, WY, WW, WH);
rect(WX + 32, WY, 2, WH, P.white);
rect(WX, WY + 22, WW, 2, P.white);
box(WX + 32, WY, 2, WH);
rect(WX - 2, WY + WH, WW + 4, 3, P.white);
box(WX - 2, WY + WH, WW + 4, 3);

// ---- bulletin board with sticky notes (right) ----
const BX = 146,
  BY = 10,
  BW = 52,
  BH = 34;
rect(BX, BY, BW, BH, P.cream);
rect(BX, BY, BW, 2, P.creamSh);
rect(BX, BY + BH - 2, BW, 2, P.creamSh);
box(BX, BY, BW, BH);
const note = (x, y, col, marks, tilt) => {
  rect(x, y, 11, 10, col);
  rect(x, y + 9, 11, 1, P.creamSh);
  box(x, y, 11, 10);
  for (let i = 0; i < marks; i++)
    rect(x + 2, y + 3 + i * 2, 7 - (i % 2) * 2, 1, P.ink);
  set(x + 5 + tilt, y + 1, P.pink); // pin
  set(x + 5 + tilt, y, P.pink);
};
note(BX + 4, BY + 4, P.hillMid, 3, 0);
note(BX + 20, BY + 5, P.lav, 2, 0);
note(BX + 36, BY + 4, P.white, 3, 0);
note(BX + 10, BY + 19, P.white, 2, 0);
note(BX + 28, BY + 19, P.hillFar, 3, 0);
rect(BX + 41, BY + 20, 8, 8, P.brand); // little diagram card
box(BX + 41, BY + 20, 8, 8);
rect(BX + 43, BY + 22, 4, 1, P.white);
rect(BX + 43, BY + 24, 4, 1, P.lav);
rect(BX + 43, BY + 26, 2, 1, P.white);

// ---- floor shadow under the desk ----
shape(
  (x, y) => ((x - 118) / 62) ** 2 + ((y - (FLOOR + 3)) / 3.4) ** 2 <= 1,
  P.lav2
);

// ---- Noma, seated behind the desk ----
const noma = placeNoma(c, { x: 84, y: 14, h: 52 });
noma.draw();

// ---- desk (drawn after Noma so it hides her lower body) ----
const DX = 52,
  DW = 132,
  DT = 62;
rect(DX, DT, DW, 3, P.woodHi);
rect(DX, DT + 3, DW, 2, P.wood);
box(DX, DT, DW, 5);
rect(DX + 4, DT + 5, DW - 8, 3, P.woodSh); // apron
box(DX + 4, DT + 5, DW - 8, 3);
[DX + 6, DX + DW - 10].forEach(lx => {
  rect(lx, DT + 8, 4, FLOOR - DT - 6, P.wood);
  rect(lx, DT + 8, 1, FLOOR - DT - 6, P.woodHi);
  box(lx, DT + 8, 4, FLOOR - DT - 6);
});

// ---- laptop (right of Noma) ----
const LX = 142;
rect(LX, 40, 30, 20, P.deep);
box(LX, 40, 30, 20);
rect(LX + 2, 42, 26, 16, P.ink);
const codeRows = [
  [3, 10, P.hillMid],
  [6, 14, P.lav],
  [6, 8, P.cream],
  [3, 12, P.hillMid],
  [6, 16, P.lav2],
  [6, 6, P.pink]
];
codeRows.forEach(([ox, len, col], i) =>
  rect(LX + 3 + ox, 44 + i * 2, len, 1, col)
);
rect(LX - 3, 60, 36, 2, P.lav);
box(LX - 3, 60, 36, 2);
// ---- mug ----
rect(176, 55, 6, 6, P.white);
rect(176, 55, 6, 1, P.lav);
rect(182, 56, 2, 3, P.white);
set(184, 57, P.ink);
box(176, 55, 6, 6);
[
  [178, 52],
  [179, 50],
  [178, 48]
].forEach(([x, y]) => set(x, y, P.white));
// ---- plant (left end of desk) ----
rect(58, 54, 10, 7, P.brand);
rect(58, 54, 10, 1, P.lav);
box(58, 54, 10, 7);
const leaves = [
  [63, 47, 3, 7],
  [58, 49, 3, 5],
  [68, 49, 3, 5],
  [60, 44, 3, 5],
  [66, 44, 3, 5]
];
leaves.forEach(([x, y, w, h]) => {
  shape(
    (px, py) => ((px - x) / w) ** 2 + ((py - y) / (h / 1.6)) ** 2 <= 1,
    P.grassDk
  );
});
leaves.forEach(([x, y, w, h]) => {
  c.outline((px, py) => ((px - x) / w) ** 2 + ((py - y) / (h / 1.6)) ** 2 <= 1);
});
leaves.forEach(([x, y, w, h]) => {
  shape(
    (px, py) => ((px - x) / w) ** 2 + ((py - y) / (h / 1.6)) ** 2 <= 1,
    P.hillMid
  );
  set(x + 1, y - 1, P.leafHi);
});
rect(63, 52, 2, 3, P.grassSh);
// ---- keyboard/paper on desk ----
rect(94, 59, 16, 3, P.white);
box(94, 59, 16, 3);

// ---- sparkles ----
c.sparkle(80, 22, 2, P.white);
c.sparkle(140, 52, 1, P.white);
c.sparkle(190, 64, 2, P.cream);
c.sparkle(78, 66, 1, P.white);
void hex;

writeScaled(c, 'public/images/world-work-day.png', wall);
