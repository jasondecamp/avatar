// Alignment check: draws the part, then the body and head outlines on top in magenta.
// Where the part's edge sits exactly on the body outline, only magenta shows.
// Any black peeking out beside the magenta is a misalignment.
//
//   node .claude/skills/layer-part/scripts/check.mjs --part outfits=path.svg --out check.png \
//     [--view torso] [--body base|human/brown|werewolf…] [--width 1000]
import { writeFileSync } from 'node:fs';

import { CANVAS, listBodies, parseView, resolvePart, image, render, parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.out || !args.part) throw new Error('--part <layer>=<path> and --out <file.png> are required');

const [layer, ref] = args.part.split('=');
const part = resolvePart(layer, ref);
const target = listBodies(true).find(b => b.name === (args.body ?? 'base'));
if (!target) throw new Error(`Unknown body '${args.body}'. Bodies: ${listBodies(true).map(b => b.name).join(', ')}`);

const [vx, vy, vw, vh] = parseView(args.view ?? 'torso');
// dark pixels → opaque magenta; light and transparent pixels → transparent
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${vw}' height='${vh}' viewBox='${vx} ${vy} ${vw} ${vh}'>
  <defs><filter id='outline'><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 0  0 0 0 0 1  -0.4 -0.4 -0.4 1 0'/></filter></defs>
  <rect width='${CANVAS}' height='${CANVAS}' fill='#fff'/>
  ${image(part)}
  ${image(target.body, "filter='url(#outline)'")}
  ${image(target.head, "filter='url(#outline)'")}
</svg>`;
writeFileSync(args.out, render(svg, Number(args.width ?? 1000)));
console.log(`${args.out}: ${layer} part on ${target.name}, view ${vx},${vy},${vw},${vh}`);
