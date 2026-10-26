import classNames from 'classnames';
import { characters } from '../characters';
import { getSnapshots } from '../services/snapshots';
import { resolveLayers } from '../services/layers';
import CSS from './styles/RecentSnapshots.module.scss';

const EMPTY_SLOTS = [0, 1, 2, 3];

export const RecentSnapshots = ({ onLoad }) => {
  const snapshots = getSnapshots();

  return (
    <div className={CSS.snapshots_section}>
      <div className={CSS.snapshots_grid}>
        {EMPTY_SLOTS.map(i => {
          const snapshot = snapshots[i];
          if (!snapshot) return <div key={i} className={CSS.snapshot_thumb} />;

          const layers = resolveLayers(snapshot.selections, characters);
          return (
            <div
              key={i}
              className={classNames(CSS.snapshot_thumb, CSS.snapshot_thumb_filled)}
              onClick={() => onLoad(snapshot.selections)}
            >
              {layers.map(({ image, blendMode }, z) => (
                <img key={z} src={image} className={CSS.layer_img} style={{ zIndex: z + 1, mixBlendMode: blendMode }} alt="" />
              ))}
            </div>
          );
        })}
      </div>
      <div className={CSS.snapshots_label}>recent snapshots</div>
    </div>
  );
};
