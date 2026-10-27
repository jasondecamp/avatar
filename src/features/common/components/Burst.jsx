import CSS from './styles/Burst.module.scss';

// Six lines that shoot outward once, when mounted (after Codrops' "Stana" click effect). Remount it
// with a new key to replay. Drawn on a box twice the parent's size; each line runs from its inner end
// to its outer end so its dash travels outward. Color comes from --burst-color on the parent,
// falling back to currentColor.
export const Burst = () => (
  <span className={CSS.burst} aria-hidden='true'>
    <svg viewBox='0 0 100 100'>
      <line x1='50' y1='24' x2='50' y2='9' />
      <line x1='72.52' y1='37' x2='85.51' y2='29.5' />
      <line x1='72.52' y1='63' x2='85.51' y2='70.5' />
      <line x1='50' y1='76' x2='50' y2='91' />
      <line x1='27.48' y1='63' x2='14.49' y2='70.5' />
      <line x1='27.48' y1='37' x2='14.49' y2='29.5' />
    </svg>
  </span>
);
