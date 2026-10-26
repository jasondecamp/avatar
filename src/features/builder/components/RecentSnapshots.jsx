import classNames from 'classnames';
import { characters } from '../characters';
import { getSnapshots } from '../services/snapshots';
import { resolveLayerImages } from '../services/layers';
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

          const images = resolveLayerImages(snapshot.selections, characters);
          return (
            <div
              key={i}
              className={classNames(CSS.snapshot_thumb, CSS.snapshot_thumb_filled)}
              onClick={() => onLoad(snapshot.selections)}
            >
              {images.map((src, z) => (
                <img key={z} src={src} className={CSS.layer_img} style={{ zIndex: z + 1 }} alt="" />
              ))}
            </div>
          );
        })}
      </div>
      <div className={CSS.snapshots_label}>recent snapshots</div>
    </div>
  );
};
