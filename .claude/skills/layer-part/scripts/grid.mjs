// Renders layers with a coordinate grid (10px fine lines, labeled 100px lines) for reading positions by eye.
//
//   node .claude/skills/layer-part/scripts/grid.mjs --image body.png [--image part.svg …] --out grid.png [--view torso] [--step 10]
import { writeFileSync } from 'node:fs';

import { CANVAS, parseView, image, render, parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), ['image']);
if (!args.out || !args.image) throw new Error('--image <path> (repeatable) and --out <file.png> are required');

const [vx, vy, vw, vh] = parseView(args.view);
const step = Number(args.step ?? 10), font = Math.max(8, vw / 50);
let lines = '';
for (let v = 0; v <= CANVAS; v += step) {
  const major = v % 100 === 0, style = `stroke='${major ? '#f33' : '#9cf'}' stroke-width='${major ? vw / 600 : vw / 1600}'`;
  lines += `<line x1='${v}' y1='0' x2='${v}' y2='${CANVAS}' ${style}/><line x1='0' y1='${v}' x2='${CANVAS}' y2='${v}' ${style}/>`;
  if (major) lines += `<text x='${v + 2}' y='${vy + font}' font-size='${font}' fill='#f00'>${v}</text><text x='${vx + 2}' y='${v - 2}' font-size='${font}' fill='#f00'>${v}</text>`;
}
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${vw}' height='${vh}' viewBox='${vx} ${vy} ${vw} ${vh}'>
  <rect width='${CANVAS}' height='${CANVAS}' fill='#fff'/>${args.image.map(p => image(p)).join('')}${lines}</svg>`;
writeFileSync(args.out, render(svg, Number(args.width ?? 1000)));
console.log(args.out);
