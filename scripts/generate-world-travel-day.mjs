// Daytime "Viajes" world art: Noma at the airport with a suitcase (procedural pixel art).
// Usage: node scripts/generate-world-travel-day.mjs
import {
  H,
  W,
  P,
  bayer,
  cloud,
  createCanvas,
  inCircle,
  inRound,
  placeNoma,
  writeScaled
} from './lib/pixel-art.mjs';

const c = createCanvas();
const { set, rect, shape, box } = c;
const FLOOR = 62;

// ---- wall + big window ----
rect(0, 0, W, H, P.lavPale);
const WX = 8,
  WY = 7,
  WW = 192,
  WH = 50;
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
shape((x, y) => inCircle(x, y, 168, 20, 8), P.sunHi);
shape((x, y) => inCircle(x, y, 168, 20, 6), P.sun);
cloud(c, 36, 20, 0.8);
cloud(c, 120, 14, 0.6);
cloud(c, 188, 38, 0.5);
// distant hills + runway strip
const hill = x => WY + WH - 10 - 4 * Math.sin(x / 17 + 1) - 2 * Math.sin(x / 7);
shape(
  (x, y) => x >= WX && x < WX + WW && y < WY + WH && y >= hill(x),
  P.hillFar
);
rect(WX, WY + WH - 6, WW, 6, P.lav);
for (let x = WX + 4; x < WX + WW; x += 12) rect(x, WY + WH - 4, 6, 1, P.white);
// control tower
rect(34, WY + WH - 22, 5, 16, P.lav2);
rect(31, WY + WH - 28, 11, 6, P.white);
rect(31, WY + WH - 26, 11, 2, P.sky1);
box(31, WY + WH - 28, 11, 6);
rect(36, WY + WH - 32, 1, 4, P.ink);
// plane (white, violet wings), banking up-left to right
const plane = (ox, oy) => {
  rect(ox, oy, 26, 5, P.white); // fuselage
  rect(ox + 22, oy - 1, 4, 5, P.white);
  rect(ox + 26, oy + 1, 2, 3, P.white); // nose
  rect(ox + 2, oy - 6, 4, 6, P.brand); // tail fin
  rect(ox + 11, oy + 5, 10, 3, P.brand); // near wing
  rect(ox + 8, oy + 8, 6, 2, P.lav2);
  rect(ox + 14, oy - 3, 8, 3, P.lav); // far wing
  for (let i = 0; i < 6; i++) set(ox + 8 + i * 2, oy + 2, P.sky1);
  c.outline(
    (x, y) =>
      x >= ox &&
      x < ox + 28 &&
      y >= oy - 6 &&
      y < oy + 10 &&
      !!c.get(x, y) &&
      [P.white, P.brand, P.lav2, P.lav].includes(c.get(x, y))
  );
};
plane(78, 20);
// contrail
for (let i = 0; i < 22; i++) {
  set(76 - i * 2, 22 + Math.round(i * 0.25), P.white);
  set(75 - i * 2, 23 + Math.round(i * 0.25), P.cloudSh);
}
// frame + mullions
box(WX, WY, WW, WH);
[WX + 62, WX + 126].forEach(mx => {
  rect(mx, WY, 3, WH, P.white);
  box(mx, WY, 3, WH);
});
rect(WX - 2, WY + WH, WW + 4, 3, P.white);
box(WX - 2, WY + WH, WW + 4, 3);

// ---- floor ----
rect(0, FLOOR, W, H - FLOOR, P.white);
for (let y = FLOOR; y < H; y++)
  for (let x = 0; x < W; x++) {
    const row = Math.floor((y - FLOOR) / 9);
    const cell = Math.floor((x + (row % 2) * 12) / 24);
    if ((x + (row % 2) * 12) % 24 === 0 || (y - FLOOR) % 9 === 0)
      set(x, y, P.cloudSh);
    else if ((cell + row) % 2 === 0 && bayer(x, y) < 0.25) set(x, y, P.lavPale);
    if (y > 86 && bayer(x, y) < (y - 86) / 36) set(x, y, P.lav);
  }

// ---- floor shadows ----
shape((x, y) => ((x - 106) / 26) ** 2 + ((y - 86) / 3) ** 2 <= 1, P.lav2);
shape((x, y) => ((x - 172) / 24) ** 2 + ((y - 83) / 2.6) ** 2 <= 1, P.lav2);
shape((x, y) => ((x - 54) / 14) ** 2 + ((y - 83) / 2.4) ** 2 <= 1, P.lav2);

// ---- Noma ----
const noma = placeNoma(c, { x: 88, y: 38, h: 46 });
noma.draw();

// ---- suitcase (left of Noma) ----
const sx = 66,
  sy = 62,
  sw = 20,
  sh = 22;
shape((x, y) => inRound(x, y, sx, sy, sw, sh, 3), P.brand);
for (let y = sy; y < sy + sh; y++)
  for (let x = sx; x < sx + sw; x++)
    if (inRound(x, y, sx, sy, sw, sh, 3)) {
      if (x < sx + 2) set(x, y, P.deep);
      else if (x === sx + 3 && y > sy + 1 && y < sy + sh - 2) set(x, y, P.lav);
      else if (x === sx + 16 && y > sy + 1 && y < sy + sh - 2) set(x, y, P.lav);
    }
c.outline((x, y) => inRound(x, y, sx, sy, sw, sh, 3));
rect(sx + 6, sy - 5, 8, 4, P.lav2); // handle
box(sx + 6, sy - 5, 8, 4);
rect(sx + 8, sy - 3, 4, 2, P.lavPale);
rect(sx + 7, sy + 8, 6, 5, P.cream); // luggage tag plate
box(sx + 7, sy + 8, 6, 5);
set(sx + 9, sy + 10, P.brand);
rect(sx + 3, sy + sh, 3, 2, P.ink);
rect(sx + 14, sy + sh, 3, 2, P.ink);
// small mint backpack leaning on the suitcase
const bx = 50,
  by = 70;
shape((x, y) => inRound(x, y, bx, by, 14, 14, 4), P.hillMid);
rect(bx + 3, by + 7, 8, 4, P.grassDk);
rect(bx + 2, by + 3, 10, 1, P.grassDk);
c.outline((x, y) => inRound(x, y, bx, by, 14, 14, 4));
rect(bx + 5, by - 2, 4, 2, P.grassDk);
box(bx + 5, by - 2, 4, 2);

// ---- luggage cart (right) ----
rect(150, 80, 44, 3, P.lav2); // base
box(150, 80, 44, 3);
rect(150, 56, 2, 24, P.lav2);
box(150, 56, 2, 24);
rect(150, 55, 8, 2, P.lav2);
c.outline((x, y) => y === 55 && x >= 150 && x < 158);
[154, 188].forEach(wx => {
  shape((x, y) => inCircle(x, y, wx, 85, 2.6), P.ink);
  set(wx, 85, P.lav);
});
// two bags on the cart
shape((x, y) => inRound(x, y, 156, 64, 22, 16, 3), P.hillMid);
rect(156, 70, 22, 2, P.grassDk);
c.outline((x, y) => inRound(x, y, 156, 64, 22, 16, 3));
rect(164, 60, 6, 4, P.grassDk);
box(164, 60, 6, 4);
shape((x, y) => inRound(x, y, 179, 68, 13, 12, 3), P.lav);
rect(179, 73, 13, 2, P.lav2);
c.outline((x, y) => inRound(x, y, 179, 68, 13, 12, 3));

// ---- ticket held up near Noma (right) ----
const tx = 140,
  ty = 40;
rect(tx, ty, 16, 9, P.cream);
rect(tx + 11, ty, 1, 9, P.creamSh);
for (let y = ty + 1; y < ty + 9; y += 2) set(tx + 11, y, P.cream);
rect(tx + 2, ty + 2, 6, 1, P.brand);
rect(tx + 2, ty + 4, 4, 1, P.lav2);
rect(tx + 2, ty + 6, 7, 1, P.brand);
rect(tx + 13, ty + 2, 1, 5, P.ink);
box(tx, ty, 16, 9);

// ---- sparkles ----
c.sparkle(84, 48, 2, P.white);
c.sparkle(136, 52, 2, P.cream);
c.sparkle(40, 66, 1, P.white);
c.sparkle(196, 68, 2, P.white);
c.sparkle(140, 76, 1, P.lav);

void H;
writeScaled(c, 'public/images/world-travel-day.png', P.lavPale);
