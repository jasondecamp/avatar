import classNames from 'classnames';

import blankImage from '../characters/base/blank.png';
import placeholderImage from './images/snapshot-placeholder.png';
import { characters } from '../characters';
import { MAX_SNAPSHOTS } from '../services/snapshots';
import { resolveLayers } from '../services/layers';
import CSS from './styles/RecentSnapshots.module.scss';

const SLOTS = Array.from({ length: MAX_SNAPSHOTS }, (_, i) => i);

export const RecentSnapshots = ({ snapshots, onLoad }) => (
  <section className={CSS.snapshots_section}>
    <div className={CSS.snapshots_grid}>
      {SLOTS.map(i => {
        const snapshot = snapshots[i];
        if (!snapshot) {
          return (
            <div key={i} className={CSS.snapshot_thumb}>
              <img src={placeholderImage} className={CSS.layer_img} alt='' />
            </div>
          );
        }

        const layers = resolveLayers(snapshot.selections, characters);
        return (
          <button
            key={i}
            type='button'
            className={classNames(CSS.snapshot_thumb, CSS.snapshot_thumb_filled)}
            onClick={() => onLoad(snapshot.selections)}
            aria-label={`Load snapshot ${i + 1}`}
          >
            <img src={blankImage} className={CSS.layer_img} alt='' />
            {layers.map(({ image, blendMode }, z) => (
              <img key={z} src={image} className={CSS.layer_img} style={{ zIndex: z + 1, mixBlendMode: blendMode }} alt='' />
            ))}
          </button>
        );
      })}
    </div>
    <h2 className={CSS.snapshots_label}>Recent snapshots</h2>
  </section>
);
