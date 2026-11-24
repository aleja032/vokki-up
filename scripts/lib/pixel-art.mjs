// Shared helpers for the procedural world art scripts (dependency-free).
// Logical grid 208x117, composited with Noma, then scaled x2 (nearest) to 416x234.
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

export const W = 208;
export const H = 117;
export const SCALE = 2;

// ---- PNG helpers ----
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
export function decode(file) {
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
export function encode(w, h, data) {
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
export const hex = s => [
  parseInt(s.slice(1, 3), 16),
  parseInt(s.slice(3, 5), 16),
  parseInt(s.slice(5, 7), 16)
];
export const P = {
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
  brand: hex('#7456FF'),
  lav: hex('#C3B4FF'),
  lav2: hex('#A99BFF'),
  lavPale: hex('#E6DEFF'),
  white: hex('#F7F4EE'),
  cream: hex('#FFE9C2'),
  creamSh: hex('#E8D6B4'),
  wood: hex('#8E6FE0'),
  woodHi: hex('#B7A2FF'),
  woodSh: hex('#5B43C0'),
  deep: hex('#5A55C8'),
  pink: hex('#FF9CC2')
};

// ---- canvas ----
export function createCanvas() {
  const px = new Array(W * H).fill(null);
  const c = { px };
  c.set = (x, y, col) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && x < W && y >= 0 && y < H) px[y * W + x] = col;
  };
  c.get = (x, y) => (x >= 0 && x < W && y >= 0 && y < H ? px[y * W + x] : null);
  c.rect = (x0, y0, w, h, col) => {
    for (let y = y0; y < y0 + h; y++)
      for (let x = x0; x < x0 + w; x++) c.set(x, y, col);
  };
  c.shape = (test, col) => {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) if (test(x, y)) c.set(x, y, col);
  };
  // Ink pixel around every pixel outside the mask that touches it.
  c.outline = (maskFn, ink = P.ink) => {
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
    out.forEach(([x, y]) => c.set(x, y, ink));
  };
  // Outline a rectangle drawn with rect(): 1px ink ring just outside it.
  c.box = (x0, y0, w, h, ink = P.ink) => {
    for (let x = x0 - 1; x <= x0 + w; x++) {
      c.set(x, y0 - 1, ink);
      c.set(x, y0 + h, ink);
    }
    for (let y = y0; y < y0 + h; y++) {
      c.set(x0 - 1, y, ink);
      c.set(x0 + w, y, ink);
    }
  };
  c.sparkle = (cx, cy, r, col) => {
    c.set(cx, cy, col);
    for (let i = 1; i <= r; i++) {
      c.set(cx + i, cy, col);
      c.set(cx - i, cy, col);
      c.set(cx, cy + i, col);
      c.set(cx, cy - i, col);
    }
  };
  // Snapshot of the pixels of the given colors (to outline a multi-color object).
  c.maskOf = cols => {
    const s = new Set();
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (cols.includes(c.get(x, y))) s.add(y * W + x);
    return (x, y) => s.has(y * W + x);
  };
  return c;
}
export const inCircle = (x, y, cx, cy, r) =>
  (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
export const inRound = (x, y, x0, y0, w, h, r) => {
  if (x < x0 || y < y0 || x >= x0 + w || y >= y0 + h) return false;
  const cx = x < x0 + r ? x0 + r : x >= x0 + w - r ? x0 + w - r - 1 : x;
  const cy = y < y0 + r ? y0 + r : y >= y0 + h - r ? y0 + h - r - 1 : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r + 0.5;
};
export const bayer = (x, y) =>
  [
    [0, 2],
    [3, 1]
  ][y & 1][x & 1] / 4;
export function makeRnd(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Banded sky with dithered seams, from y=0 down to yEnd.
export function paintSky(c, yEnd) {
  const bands = [P.sky1, P.sky2, P.sky3, P.sky4];
  for (let y = 0; y < yEnd; y++) {
    const t = (y / yEnd) * bands.length;
    const i = Math.min(bands.length - 1, Math.floor(t));
    const frac = t - i;
    for (let x = 0; x < W; x++) {
      const next = Math.min(bands.length - 1, i + 1);
      c.set(
        x,
        y,
        frac > 0.8 && bayer(x, y) < (frac - 0.8) * 5 ? bands[next] : bands[i]
      );
    }
  }
}
export function cloud(c, cx, cy, s) {
  const blobs = [
    [0, 0, 7 * s],
    [-8 * s, 3 * s, 5 * s],
    [8 * s, 3 * s, 5.5 * s],
    [0, 4 * s, 6 * s]
  ];
  const inCl = (x, y) =>
    blobs.some(([dx, dy, r]) => inCircle(x, y, cx + dx, cy + dy, r));
  c.shape(inCl, P.cloud);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (
        inCl(x, y) &&
        (y > cy + 6 * s || (!inCl(x + 1, y - 2) && !inCl(x, y - 2)))
      )
        c.set(x, y, P.cloudSh);
}

// ---- Noma (composited from the 2D mascot art with area-averaging downscale) ----
const NOMA_PAL = [
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
void NOMA_PAL;
export function placeNoma(
  c,
  { x: NX, y: NY, h: NH, file = 'public/images/noma-cheer.png' }
) {
  const noma = decode(file);
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
  const NW = Math.round((srcW * NH) / srcH);
  const sprite = [];
  const mask = new Set();
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
      sprite.push([NX + tx, NY + ty, [q(r), q(g), q(b)]]);
      mask.add((NY + ty) * W + NX + tx);
    }
  return {
    w: NW,
    h: NH,
    cx: NX + NW / 2,
    // ink outline around the sprite, then the sprite itself
    draw() {
      c.outline((x, y) => mask.has(y * W + x));
      sprite.forEach(([x, y, col]) => c.set(x, y, col));
    }
  };
}

// ---- output x2 ----
export function writeScaled(c, out, fallback = P.sky3) {
  const buf = Buffer.alloc(W * SCALE * H * SCALE * 4);
  for (let y = 0; y < H * SCALE; y++)
    for (let x = 0; x < W * SCALE; x++) {
      const col =
        c.px[Math.floor(y / SCALE) * W + Math.floor(x / SCALE)] ?? fallback;
      const i = (y * W * SCALE + x) * 4;
      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = 255;
    }
  writeFileSync(out, encode(W * SCALE, H * SCALE, buf));
  console.log('wrote', out, W * SCALE, H * SCALE);
}
