// Measures outlines (opaque dark pixels) in a PNG or SVG layer, in canvas coordinates.
//
//   node .claude/skills/layer-part/scripts/measure.mjs rows <image> <y0> <y1> [step=6] [x0=0] [x1=799]
//   node .claude/skills/layer-part/scripts/measure.mjs cols <image> <x0> <x1> [step=8] [y0=0] [y1=799]
//   node .claude/skills/layer-part/scripts/measure.mjs bbox <image…>
//
// rows/cols print each outline run as start-end(center). Put a part's edge on the center of the
// body's run and stroke it 12px, and it covers the body's ~10–12px outline exactly.
// Compare a part against the body by running the same command on both and diffing the centers.
import { decodeAny, isOutline } from './lib.mjs';

const [mode, ...rest] = process.argv.slice(2);

const runs = (img, along, fixed, from, to) => {
  const out = [];
  let start = -1;
  for (let t = from; t <= to + 1; t++) {
    const dark = t <= to && isOutline(along === 'x' ? img.px(t, fixed) : img.px(fixed, t));
    if (dark && start < 0) start = t;
    if (!dark && start >= 0) { out.push(`${start}-${t - 1}(${(start + t - 1) / 2})`); start = -1; }
  }
  return out.join(' ');
};

if (mode === 'rows' || mode === 'cols') {
  const [path, a, b, step = mode === 'rows' ? 6 : 8, c = 0, d = 799] = rest;
  const img = decodeAny(path);
  for (let v = Number(a); v <= Number(b); v += Number(step)) {
    console.log(v, mode === 'rows' ? runs(img, 'x', v, Number(c), Number(d)) : runs(img, 'y', v, Number(c), Number(d)));
  }
} else if (mode === 'bbox') {
  for (const path of rest) {
    const img = decodeAny(path);
    let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
      if (img.px(x, y)[3] > 24) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    }
    console.log(path.replace(/.*characters\//, ''), `x ${x0}-${x1}  y ${y0}-${y1}`);
  }
} else {
  console.log('usage: measure.mjs rows|cols|bbox …  (see header comment)');
  process.exit(1);
}
