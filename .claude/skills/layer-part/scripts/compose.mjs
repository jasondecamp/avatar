// Contact sheet: every body with the given parts, stacked in LAYER_STACK order (the app's order).
//
//   node .claude/skills/layer-part/scripts/compose.mjs --out sheet.png \
//     --part outfits=path/to/raiden.svg --part headgear=bamboo-hat \
//     [--view full|head|torso|legs|hands|x,y,w,h] [--bodies all] [--eyes angry] [--mouths smirk-2] [--cols 3]
//
// --part takes a file path or the name of an existing part in base/<layer>/.
// Eyes and mouths default to angry / smirk-2 so faces read; pass 'none' to hide them.
import { writeFileSync } from 'node:fs';

import { LAYER_STACK, CANVAS, listBodies, parseView, resolvePart, image, render, parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), ['part']);
if (!args.out) throw new Error('--out <file.png> is required');

const parts = { eyes: args.eyes ?? 'angry', mouths: args.mouths ?? 'smirk-2' };
for (const spec of args.part ?? []) {
  const [layer, ref] = spec.split('=');
  if (!LAYER_STACK.includes(layer)) throw new Error(`Unknown layer '${layer}'. Layers: ${LAYER_STACK.join(', ')}`);
  parts[layer] = ref;
}
const partPaths = Object.fromEntries(Object.entries(parts).filter(([, ref]) => ref !== 'none').map(([layer, ref]) => [layer, resolvePart(layer, ref)]));

const [vx, vy, vw, vh] = parseView(args.view);
const bodies = listBodies(args.bodies === 'all');
const cols = Number(args.cols ?? 3), rows = Math.ceil(bodies.length / cols);

const tiles = bodies.map(({ name, body, head }, i) => {
  const layers = LAYER_STACK
    .map(label => ({ body, head }[label] ?? partPaths[label]))
    .filter(Boolean)
    .map(path => image(path))
    .join('');
  const x = (i % cols) * vw, y = Math.floor(i / cols) * vh;
  return `<svg x='${x}' y='${y}' width='${vw}' height='${vh}' viewBox='${vx} ${vy} ${vw} ${vh}'>
    <rect width='${CANVAS}' height='${CANVAS}' fill='#fff'/>${layers}
    <rect x='${vx}' y='${vy}' width='${vw}' height='${vh}' fill='none' stroke='#ccc' stroke-width='2'/>
    <text x='${vx + 10}' y='${vy + 26}' font-size='${Math.max(14, vw / 30)}' font-family='sans-serif'>${name}</text></svg>`;
});

const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${cols * vw}' height='${rows * vh}'>${tiles.join('')}</svg>`;
writeFileSync(args.out, render(svg, Number(args.width ?? 1500)));
console.log(`${args.out}: ${bodies.length} bodies, layers ${LAYER_STACK.filter(l => l === 'body' || l === 'head' || partPaths[l]).join(' → ')}`);
