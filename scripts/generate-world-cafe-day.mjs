// Recolors the night cafe world art into a daytime palette (nearest-neighbour, no smoothing).
// Usage: node scripts/generate-world-cafe-day.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

const SRC = 'public/images/world-cafe-words.png';
const OUT = 'public/images/world-cafe-day.png';

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
function rgb2hsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b),
    l = (mx + mn) / 2,
    d = mx - mn;
  let h = 0,
    s = 0;
  if (d) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h =
      mx === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : mx === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}
function hsl2rgb(h, s, l) {
  const f = n => {
    const k = (n + h / 30) % 12;
    return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)].map(v =>
    Math.round(Math.max(0, Math.min(1, v)) * 255)
  );
}
const lerp = (a, b, t) => a + (b - a) * t;

function day(r, g, b, x, y) {
  const [h, s, l] = rgb2hsl(r, g, b);
  const warm = h < 60 || h > 340;
  const green = h >= 70 && h < 170;
  const cyan = h >= 170 && h < 215;
  const topZone = y < 95 && x < 250; // open background above the grass: sky
  if (warm)
    return hsl2rgb(38, Math.min(0.75, s * 0.8), Math.min(0.9, 0.62 + 0.35 * l)); // sunlit cream/peach
  if (green)
    return hsl2rgb(
      h - 5,
      Math.min(0.7, s * 0.85 + 0.1),
      Math.min(0.78, 0.3 + 0.6 * l)
    );
  if (cyan)
    return hsl2rgb(200, Math.min(0.75, s), Math.min(0.85, 0.5 + 0.45 * l)); // water
  // indigo / purple family
  if (l > 0.5 && s > 0.4 && !(topZone && y < 75)) {
    // flowers: warm accents
    const k = (((x / 28) | 0) * 7 + ((y / 28) | 0) * 13) % 3;
    const hue = [8, 46, 340][k];
    return k === 1
      ? hsl2rgb(46, 0.9, 0.62)
      : hsl2rgb(hue, 0.78, 0.4 + 0.45 * l);
  }
  if (x > 215 && y < 110) {
    // wall/building to the right: warm sunlit wood and cream
    return hsl2rgb(28, 0.42, Math.min(0.8, 0.38 + 0.9 * l));
  }
  if (topZone) return hsl2rgb(204, 0.75, Math.min(0.82, 0.62 + 0.5 * l)); // sky blue
  // ground, rock and foliage shadow: natural greens, browns, sand
  if (l < 0.22) return hsl2rgb(150, 0.3, 0.2 + 0.8 * l);
  return y > 200
    ? hsl2rgb(36, 0.35, 0.3 + 0.7 * l)
    : hsl2rgb(110, 0.4, 0.3 + 0.7 * l);
}

const { w, h, data } = decode(SRC);
const out = Buffer.from(data);
// word labels: [x0, y0, x1, y1] — cream fill, dark ink, so words read on a bright scene
const LABELS = [
  [110, 26, 203, 67],
  [74, 84, 219, 137],
  [298, 128, 393, 179]
];
const inLabel = (x, y) =>
  LABELS.some(([a, b, c, d]) => x >= a && x < c && y >= b && y < d);
for (let i = 0; i < w * h; i++) {
  const x = i % w,
    y = (i / w) | 0;
  const R = data[i * 4],
    G = data[i * 4 + 1],
    B = data[i * 4 + 2];
  const [hh, ss, ll] = rgb2hsl(R, G, B);
  let o;
  if (inLabel(x, y)) {
    if (ll < 0.38)
      o = hsl2rgb(hh > 100 && hh < 200 ? 150 : 270, 0.35, 0.94); // fill
    else if (ll > 0.62)
      o = hsl2rgb(hh > 100 && hh < 200 ? 150 : 255, 0.6, 0.2); // text
    else o = hsl2rgb(hh > 100 && hh < 200 ? 150 : 265, 0.45, 0.45); // border
  } else o = day(R, G, B, x, y);
  out[i * 4] = o[0];
  out[i * 4 + 1] = o[1];
  out[i * 4 + 2] = o[2];
}
writeFileSync(OUT, encode(w, h, out));
console.log('wrote', OUT, w, h);
