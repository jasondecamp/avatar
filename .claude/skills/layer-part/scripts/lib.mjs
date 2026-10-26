// Shared helpers for the layer-part art scripts. Run scripts from the repo root with node.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

import { LAYER_STACK, getBlendMode } from '../../../../src/features/builder/services/layers.js';

export { LAYER_STACK, getBlendMode };
export const REPO = resolve(fileURLToPath(import.meta.url), '../../../../..');
export const CHARACTERS = `${REPO}/src/features/builder/characters`;
export const CANVAS = 800;

// Named view boxes in canvas coordinates: x,y,w,h
export const VIEWS = {
  full: [0, 0, 800, 800],
  head: [60, 0, 680, 540],
  torso: [120, 420, 560, 360],
  legs: [150, 600, 450, 170],
  hands: [130, 540, 540, 140],
};
export const parseView = (v = 'full') => VIEWS[v] ?? v.split(',').map(Number);

// Minimal PNG decoder (8-bit RGB/RGBA, non-interlaced) → { w, h, px(x, y) → [r, g, b, a] }
export const decodePng = (path) => {
  const b = readFileSync(path);
  let p = 8, w, h, ct;
  const idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8), d = b.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9];
      if (d[8] !== 8 || d[12]) throw new Error(`${path}: only 8-bit non-interlaced PNGs are supported`);
    }
    if (type === 'IDAT') idat.push(d);
    p += 12 + len;
  }
  const bpp = { 6: 4, 2: 3 }[ct];
  if (!bpp) throw new Error(`${path}: unsupported PNG color type ${ct}`);
  const raw = inflateSync(Buffer.concat(idat)), stride = w * bpp, out = Buffer.alloc(w * h * 4);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0, up = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      const paeth = () => { const q = a + up - c, pa = Math.abs(q - a), pb = Math.abs(q - up), pc = Math.abs(q - c); return pa <= pb && pa <= pc ? a : pb <= pc ? up : c; };
      line[i] = (line[i] + [0, a, up, (a + up) >> 1, f === 4 ? paeth() : 0][f]) & 255;
    }
    for (let x = 0; x < w; x++) for (let k = 0; k < 4; k++) out[(y * w + x) * 4 + k] = k < bpp ? line[x * bpp + k] : 255;
    prev = line;
  }
  return { w, h, px: (x, y) => { const i = (y * w + x) * 4; return [out[i], out[i + 1], out[i + 2], out[i + 3]]; } };
};

// Rasterizes an image (PNG or SVG) the same way the app does, so measurement works on SVG parts too
export const decodeAny = (path) => {
  if (extname(path) !== '.svg') return decodePng(path);
  const tmp = `${tmpdir()}/layer-part-${process.pid}.png`;
  writeFileSync(tmp, new Resvg(readFileSync(path, 'utf8')).render().asPng());
  return decodePng(tmp);
};

// Outline pixels: opaque and dark
export const isOutline = ([r, g, b, a]) => a > 128 && r + g + b < 240;

export const dataUri = (path) => {
  const type = extname(path) === '.svg' ? 'image/svg+xml' : 'image/png';
  return `data:${type};base64,${readFileSync(path).toString('base64')}`;
};
export const image = (path, extra = '') => `<image href='${dataUri(path)}' width='800' height='800' ${extra}/>`;

// Every selectable body: base plus each character body (default only unless allBodies)
export const listBodies = (allBodies = false) => {
  const bodies = [{ name: 'base', body: `${CHARACTERS}/base/body.png`, head: `${CHARACTERS}/base/head.png` }];
  for (const character of readdirSync(CHARACTERS)) {
    const dir = `${CHARACTERS}/${character}`;
    if (character === 'base' || !existsSync(`${dir}/bodies`)) continue;
    for (const variant of readdirSync(`${dir}/bodies`)) {
      if (!allBodies && variant !== 'default') continue;
      bodies.push({ name: variant === 'default' ? character : `${character}/${variant}`, body: `${dir}/bodies/${variant}/body.png`, head: `${dir}/bodies/${variant}/head.png` });
    }
  }
  return bodies;
};

// Resolves a part reference: a file path, or an existing part name looked up in base/<layer>/
export const resolvePart = (layer, ref) => {
  if (existsSync(ref)) return resolve(ref);
  for (const ext of ['.svg', '.png']) {
    const path = `${CHARACTERS}/base/${layer}/${ref}${ext}`;
    if (existsSync(path)) return path;
  }
  throw new Error(`No ${layer} part found for '${ref}'`);
};

export const render = (svg, outWidth) => new Resvg(svg, { fitTo: { mode: 'width', value: outWidth }, font: { loadSystemFonts: true } }).render().asPng();

// --flag value pairs; repeatable flags collect into arrays
export const parseArgs = (argv, repeatable = []) => {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2), value = argv[i + 1]?.startsWith('--') || argv[i + 1] == null ? true : argv[++i];
    if (repeatable.includes(key)) (args[key] ??= []).push(value);
    else args[key] = value;
  }
  return args;
};
