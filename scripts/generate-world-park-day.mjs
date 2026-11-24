// Draws the daytime "Dia a dia" world art: Noma in a sunny park (procedural pixel art).
// Logical grid 208x117, composited with Noma, then scaled x2 (nearest) to 416x234.
// Usage: node scripts/generate-world-park-day.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

const NOMA = 'public/images/noma-cheer.png';
const OUT = 'public/images/world-park-day.png';
const W = 208;
const H = 117;
const SCALE = 2;

// ---- PNG helpers (no dependencies) ----
function crc32(buf) {
  let c,
    crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function decode(file) {
  const b = readFileSync(file);
  let p = 8,
    w = 0,
    h = 0,
    bpp = 4;
  const idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p),
      type = b.toString('ascii', p + 4, p + 8);
    const d = b.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = d.readUInt32BE(0);
      h = d.readUInt32BE(4);
      bpp = d[9] === 6 ? 4 : 3;
    }
    if (type === 'IDAT') idat.push(d);
    p += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * bpp,
    px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x];
      const a = x >= bpp ? px[y * stride + x - bpp] : 0;
      const u = y ? px[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y ? px[(y - 1) * stride + x - bpp] : 0;
      let r;
      if (f === 0) r = v;
      else if (f === 1) r = v + a;
      else if (f === 2) r = v + u;
      else if (f === 3) r = v + ((a + u) >> 1);
      else {
        const pp = a + u - c,
          pa = Math.abs(pp - a),
          pb = Math.abs(pp - u),
          pc = Math.abs(pp - c);
        r = v + (pa <= pb && pa <= pc ? a : pb <= pc ? u : c);
      }
      px[y * stride + x] = r & 255;
    }
  }
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    out[i * 4] = px[i * bpp];
    out[i * 4 + 1] = px[i * bpp + 1];
    out[i * 4 + 2] = px[i * bpp + 2];
    out[i * 4 + 3] = bpp === 4 ? px[i * bpp + 3] : 255;
  }
  return { w, h, data: out };
}
function encode(w, h, data) {
  const stride = w * 4,
    raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ---- palette ----
const hex = s => [
  parseInt(s.slice(1, 3), 16),
  parseInt(s.slice(3, 5), 16),
  parseInt(s.slice(5, 7), 16)
];
const P = {
  ink: hex('#191531'),
  sky1: hex('#9CC4FF'),
  sky2: hex('#B8D6FF'),
  sky3: hex('#D3E5FF'),
  sky4: hex('#EAF2FF'),
  sun: hex('#FFE9C2'),
  sunHi: hex('#FFF7E0'),
  cloud: hex('#F7F4EE'),
  cloudSh: hex('#D9D0FF'),
  hillFar: hex('#A9ECD6'),
  hillMid: hex('#6EE7C2'),
  grass: hex('#52DBB0'),
  grassDk: hex('#2FCB9B'),
  grassSh: hex('#3FA9A0'),
  leafHi: hex('#8CF2D2'),
  leaf: hex('#2FCB9B'),
  leafSh: hex('#4A7FC4'),
  leafDeep: hex('#5A55C8'),
  trunk: hex('#6B4F9E'),
  trunkSh: hex('#4A3A7A'),
  path: hex('#FFE9C2'),
  pathSh: hex('#E8D6B4'),
  brand: hex('#7456FF'),
  lav: hex('#C3B4FF'),
  lav2: hex('#A99BFF'),
  white: hex('#F7F4EE'),
  wood: hex('#8E6FE0'),
  woodHi: hex('#B7A2FF'),
  woodSh: hex('#5B43C0'),
  cup: hex('#F7F4EE')
};

// ---- canvas ----
const px = new Array(W * H).fill(null);
const set = (x, y, c) => {
  x = Math.round(x);
  y = Math.round(y);
  if (x >= 0 && x < W && y >= 0 && y < H) px[y * W + x] = c;
};
const get = (x, y) =>
  x >= 0 && x < W && y >= 0 && y < H ? px[y * W + x] : null;
const rect = (x0, y0, w, h, c) => {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) set(x, y, c);
};
const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
function shape(test, color) {
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) if (test(x, y)) set(x, y, color);
}
// Outline: ink pixel around every pixel of mask that borders outside the mask.
function outline(maskFn, ink = P.ink) {
  const out = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (!maskFn(x, y)) {
        if (
          maskFn(x - 1, y) ||
          maskFn(x + 1, y) ||
          maskFn(x, y - 1) ||
          maskFn(x, y + 1)
        )
          out.push([x, y]);
      }
  out.forEach(([x, y]) => set(x, y, ink));
}
let seed = 7;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const bayer = (x, y) =>
  [
    [0, 2],
    [3, 1]
  ][y & 1][x & 1] / 4;

// ---- sky: banded gradient with 2px dithered seams ----
const HORIZON = 54;
const bands = [P.sky1, P.sky2, P.sky3, P.sky4];
for (let y = 0; y < HORIZON + 12; y++) {
  const t = (y / HORIZON) * bands.length;
  const i = Math.min(bands.length - 1, Math.floor(t));
  const frac = t - i;
  for (let x = 0; x < W; x++) {
    const next = Math.min(bands.length - 1, i + 1);
    set(
      x,
      y,
      frac > 0.8 && bayer(x, y) < (frac - 0.8) * 5 ? bands[next] : bands[i]
    );
  }
}

// ---- sun (upper right) ----
shape((x, y) => inCircle(x, y, 104, 17, 12), P.sunHi);
shape((x, y) => inCircle(x, y, 104, 17, 9), P.sun);
// sparse sun rays
[
  [104, 1],
  [104, 33],
  [88, 17],
  [120, 17],
  [93, 6],
  [115, 6],
  [93, 28],
  [115, 28]
].forEach(([x, y]) => set(x, y, P.sunHi));

// ---- clouds ----
function cloud(cx, cy, s) {
  const blobs = [
    [0, 0, 7 * s],
    [-8 * s, 3 * s, 5 * s],
    [8 * s, 3 * s, 5.5 * s],
    [0, 4 * s, 6 * s]
  ];
  const inCl = (x, y) =>
    blobs.some(([dx, dy, r]) => inCircle(x, y, cx + dx, cy + dy, r));
  shape(inCl, P.cloud);
  // violet-tinted underside (light from the upper right)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (inCl(x, y) && !inCl(x + 1, y - 2) && !inCl(x, y - 2))
        set(x, y, P.cloudSh);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (inCl(x, y) && y > cy + 6 * s) set(x, y, P.cloudSh);
}
cloud(92, 40, 0.7);
cloud(158, 12, 0.9);
cloud(190, 40, 0.6);

// birds
[
  [66, 32],
  [76, 28],
  [58, 27]
].forEach(([x, y]) => {
  set(x, y, P.ink);
  set(x + 1, y + 1, P.ink);
  set(x + 2, y, P.ink);
  set(x + 3, y + 1, P.ink);
  set(x + 4, y, P.ink);
});

// ---- far hills ----
const farY = x => HORIZON - 6 - 5 * Math.sin(x / 22 + 1) - 3 * Math.sin(x / 9);
const midY = x =>
  HORIZON + 1 - 4 * Math.sin(x / 30 + 3) - 1.5 * Math.sin(x / 11);
shape((x, y) => y >= farY(x), P.hillFar);
shape((x, y) => y >= midY(x), P.hillMid);
// tiny distant trees on the far hill
[
  [14, 0],
  [100, 0],
  [124, 0],
  [160, 0],
  [196, 0]
].forEach(([x]) => {
  const y = Math.round(farY(x)) - 1;
  rect(x - 2, y - 3, 5, 4, P.hillMid);
  rect(x - 1, y - 4, 3, 1, P.hillMid);
});

// ---- ground ----
shape((x, y) => y >= HORIZON + 7, P.grass);
// grass banding for depth (rows of darker tufts), lighter farther away
for (let y = HORIZON + 7; y < H; y += 1) {
  for (let x = 0; x < W; x++) {
    const band = Math.floor((y - HORIZON) / 9);
    if (
      get(x, y) === P.grass &&
      (x * 7 + band * 13) % 17 === 0 &&
      y % 9 === 4
    ) {
      set(x, y, P.grassDk);
      set(x + 1, y - 1, P.grassDk);
    }
  }
}
// lower calm band: slightly deeper grass so the card shade blends in
for (let y = 84; y < H; y++)
  for (let x = 0; x < W; x++)
    if (get(x, y) === P.grass && bayer(x, y) < (y - 84) / 40)
      set(x, y, P.grassDk);

// ---- path (cream, winds from the bottom toward the horizon on the left-center) ----
const pathCenter = y =>
  86 + 14 * Math.sin((y - HORIZON) / 12) - (y - HORIZON) * 0.15;
const pathHalf = y => 2 + (y - (HORIZON + 7)) * 0.24;
const inPath = (x, y) =>
  y >= HORIZON + 7 && Math.abs(x - pathCenter(y)) <= pathHalf(y);
shape(inPath, P.path);
for (let y = HORIZON + 7; y < H; y++)
  for (let x = 0; x < W; x++)
    if (
      inPath(x, y) &&
      (x < pathCenter(y) - pathHalf(y) + 1.5 ||
        (bayer(x, y) < 0.15 && (x + y) % 5 === 0))
    )
      set(x, y, P.pathSh);

// ---- tree (left) ----
const TX = 36;
const trunkTop = 38;
const trunkBase = 78;
const inTrunk = (x, y) =>
  y >= trunkTop &&
  y <= trunkBase &&
  Math.abs(x - TX) <= 3 + (y > 70 ? (y - 70) * 0.5 : 0);
const crown = [
  [TX, 22, 16],
  [TX - 13, 30, 11],
  [TX + 13, 30, 11],
  [TX - 6, 14, 10],
  [TX + 7, 15, 10],
  [TX, 34, 9]
];
const inCrown = (x, y) =>
  crown.some(([cx, cy, r]) => inCircle(x, y, cx, cy, r));
// shadow under the tree
shape(
  (x, y) =>
    ((x - (TX + 6)) / 22) ** 2 + ((y - 79) / 4) ** 2 <= 1 && !inTrunk(x, y),
  P.grassDk
);
shape(inTrunk, P.trunk);
for (let y = trunkTop; y <= trunkBase; y++)
  for (let x = 0; x < W; x++)
    if (inTrunk(x, y) && x < TX - 0) set(x, y, P.trunkSh);
// root flare / branch stubs
set(TX - 4, 76, P.trunkSh);
set(TX + 4, 76, P.trunk);
shape(inCrown, P.leaf);
// shade: lower-left side violet-tinted, highlight upper-right (sun is upper right)
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    if (!inCrown(x, y)) continue;
    const l = (x - TX) * 0.55 - (y - 26) * 0.8; // >0 toward the sun
    if (l < -7) set(x, y, P.leafDeep);
    else if (l < -1 && bayer(x, y) < 0.7) set(x, y, P.leafSh);
    else if (l < 3 && bayer(x, y) < 0.3) set(x, y, P.leafSh);
    else if (l > 8) set(x, y, P.leafHi);
    else if (l > 4 && bayer(x, y) < 0.5) set(x, y, P.leafHi);
  }
// leaf clumps: tiny hi/low pixels
for (let i = 0; i < 40; i++) {
  const x = TX - 22 + Math.floor(rnd() * 46);
  const y = 6 + Math.floor(rnd() * 40);
  if (inCrown(x, y) && inCrown(x + 1, y) && inCrown(x, y + 1)) {
    set(x, y, x > TX ? P.leafHi : P.leafSh);
    set(x + 1, y, x > TX ? P.leafHi : P.leafSh);
  }
}
outline(inCrown);
outline(inTrunk);
// re-outline crown over trunk top where they join
for (let x = TX - 4; x <= TX + 4; x++)
  if (inCrown(x, 42) && !inCrown(x, 43)) set(x, 43, P.ink);
// fix: ground line under trunk
for (let x = TX - 7; x <= TX + 7; x++)
  if (get(x, trunkBase + 1) === P.ink) set(x, trunkBase + 1, P.ink);

// ---- bench (center-left, in front of the path) ----
const BX = 78;
const BY = 62; // seat top
// shadow
shape(
  (x, y) => ((x - (BX + 20)) / 24) ** 2 + ((y - (BY + 16)) / 2.6) ** 2 <= 1,
  P.grassDk
);
// backrest
rect(BX, BY - 11, 40, 3, P.wood);
rect(BX, BY - 7, 40, 3, P.wood);
rect(BX, BY - 11, 40, 1, P.woodHi);
rect(BX, BY - 7, 40, 1, P.woodHi);
rect(BX + 2, BY - 12, 3, 12, P.woodSh);
rect(BX + 35, BY - 12, 3, 12, P.woodSh);
// seat
rect(BX - 2, BY, 44, 4, P.wood);
rect(BX - 2, BY, 44, 1, P.woodHi);
rect(BX - 2, BY + 3, 44, 1, P.woodSh);
// legs
rect(BX + 2, BY + 4, 3, 10, P.woodSh);
rect(BX + 35, BY + 4, 3, 10, P.woodSh);
rect(BX + 1, BY + 13, 5, 2, P.woodSh);
rect(BX + 34, BY + 13, 5, 2, P.woodSh);
const benchMask = (x, y) => {
  const c = get(x, y);
  return c === P.wood || c === P.woodHi || c === P.woodSh;
};
// capture mask before outlining
const benchSnap = new Set();
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) if (benchMask(x, y)) benchSnap.add(y * W + x);
outline((x, y) => benchSnap.has(y * W + x));
// coffee cup on the seat
rect(BX + 26, BY - 5, 6, 5, P.cup);
rect(BX + 26, BY - 5, 6, 1, P.lav);
rect(BX + 32, BY - 4, 2, 3, P.cup);
set(BX + 34, BY - 3, P.ink);
outlineBox(BX + 26, BY - 5, 6, 5);
function outlineBox(x0, y0, w, h) {
  for (let x = x0 - 1; x <= x0 + w; x++) {
    set(x, y0 - 1, P.ink);
    set(x, y0 + h, P.ink);
  }
  for (let y = y0; y < y0 + h; y++) set(x0 - 1, y, P.ink);
  for (let y = y0; y < y0 + h; y++) set(x0 + w, y, P.ink);
}
// steam
[
  [BX + 28, BY - 9],
  [BX + 29, BY - 11],
  [BX + 28, BY - 13]
].forEach(([x, y]) => set(x, y, P.white));
set(BX + 30, BY - 10, P.white);

// ---- flowers (violet / lavender / white), keep off the path and the sitting area ----
const blockedForFlower = (x, y) =>
  inPath(x, y) ||
  (x > 124 && x < 190 && y > 20 && y < 90) || // Noma
  (x > BX - 6 && x < BX + 48 && y > BY - 16 && y < BY + 18) ||
  (x > TX - 8 && x < TX + 8 && y > 70 && y < 82);
const flowerCols = [P.brand, P.lav, P.white, P.lav2, P.white];
let placed = 0;
let guard = 0;
while (placed < 34 && guard++ < 2000) {
  const x = 4 + Math.floor(rnd() * (W - 8));
  const y = HORIZON + 12 + Math.floor(rnd() * 44);
  if (blockedForFlower(x, y) || y > 98) continue;
  const c = flowerCols[placed % flowerCols.length];
  const petal = placed % 3 === 0;
  if (petal) {
    set(x, y - 1, c);
    set(x - 1, y, c);
    set(x + 1, y, c);
    set(x, y + 1, c);
    set(x, y, P.sun);
  } else {
    set(x, y, c);
    set(x + 1, y, c);
    set(x, y + 1, P.grassDk);
  }
  placed++;
}

// ---- Noma ----
const noma = decode(NOMA);
let x0 = noma.w,
  y0 = noma.h,
  x1 = 0,
  y1 = 0;
for (let y = 0; y < noma.h; y++)
  for (let x = 0; x < noma.w; x++)
    if (noma.data[(y * noma.w + x) * 4 + 3] > 200) {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
const srcW = x1 - x0 + 1;
const srcH = y1 - y0 + 1;
const NH = 56;
const NW = Math.round((srcW * NH) / srcH);
const NX = 130; // left of Noma sprite
const NY = 24; // top of Noma sprite
const nomaPal = [
  '#191531',
  '#3A2A7A',
  '#5B3FC4',
  '#8A5CE0',
  '#B58CF5',
  '#D6B8FF',
  '#6EE7C2',
  '#A8F5DD',
  '#F7F4EE',
  '#FF9CC2'
].map(hex);
const nearest = (r, g, b) => {
  let best = nomaPal[0],
    bd = 1e9;
  for (const c of nomaPal) {
    const d = (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2;
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  return best;
};
const sprite = []; // [x,y,color]
const spriteMask = new Set();
for (let ty = 0; ty < NH; ty++)
  for (let tx = 0; tx < NW; tx++) {
    const sx0 = x0 + (tx * srcW) / NW,
      sx1 = x0 + ((tx + 1) * srcW) / NW;
    const sy0 = y0 + (ty * srcH) / NH,
      sy1 = y0 + ((ty + 1) * srcH) / NH;
    let r = 0,
      g = 0,
      b = 0,
      a = 0,
      n = 0;
    for (let sy = Math.floor(sy0); sy < Math.ceil(sy1); sy++)
      for (let sx = Math.floor(sx0); sx < Math.ceil(sx1); sx++) {
        const i = (sy * noma.w + sx) * 4;
        const al = noma.data[i + 3] / 255;
        r += noma.data[i] * al;
        g += noma.data[i + 1] * al;
        b += noma.data[i + 2] * al;
        a += al;
        n++;
      }
    if (!n || a / n < 0.62) continue;
    const q = v => Math.min(255, Math.round(v / a / 20) * 20);
    const c = [q(r), q(g), q(b)];
    sprite.push([NX + tx, NY + ty, c]);
    spriteMask.add((NY + ty) * W + NX + tx);
  }
// soft ground shadow under Noma
const NCX = NX + NW / 2;
shape(
  (x, y) => ((x - NCX) / 15) ** 2 + ((y - (NY + NH + 3)) / 3) ** 2 <= 1,
  P.grassDk
);
shape(
  (x, y) => ((x - NCX) / 9) ** 2 + ((y - (NY + NH + 3)) / 1.8) ** 2 <= 1,
  P.grassSh
);
// ink outline around sprite, then sprite
outline((x, y) => spriteMask.has(y * W + x));
sprite.forEach(([x, y, c]) => set(x, y, c));

// ---- sparkles (4-point stars) ----
function sparkle(cx, cy, r, c) {
  set(cx, cy, c);
  for (let i = 1; i <= r; i++) {
    set(cx + i, cy, c);
    set(cx - i, cy, c);
    set(cx, cy + i, c);
    set(cx, cy - i, c);
  }
}
sparkle(124, 40, 3, P.white);
sparkle(182, 48, 2, P.white);
sparkle(130, 74, 2, P.lav);
sparkle(60, 58, 2, P.white);
sparkle(190, 76, 3, P.sunHi);
sparkle(190, 30, 2, P.white);
sparkle(176, 30, 1, P.white);
sparkle(20, 60, 1, P.white);

// ---- output x2 ----
const out = Buffer.alloc(W * SCALE * H * SCALE * 4);
for (let y = 0; y < H * SCALE; y++)
  for (let x = 0; x < W * SCALE; x++) {
    const c = px[Math.floor(y / SCALE) * W + Math.floor(x / SCALE)] ?? P.sky3;
    const i = (y * W * SCALE + x) * 4;
    out[i] = c[0];
    out[i + 1] = c[1];
    out[i + 2] = c[2];
    out[i + 3] = 255;
  }
writeFileSync(OUT, encode(W * SCALE, H * SCALE, out));
console.log('wrote', OUT, W * SCALE, H * SCALE);
