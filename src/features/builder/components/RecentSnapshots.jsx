import classNames from 'classnames';
import { characters } from '../characters';
import { getSnapshots } from '../services/snapshots';
import CSS from './styles/RecentSnapshots.module.scss';

const resolveImages = (selections) => {
  const character = characters[selections.character];
  if (!character) return [];

  const selectedBody = character.bodies.find(b => b.label === selections.body);
  const bodyImage = selectedBody?.bodyImage ?? character.bodyImage;
  const headImage = selectedBody?.headImage ?? character.headImage;

  const getLayerImage = (label) => {
    const layer = character.layers.find(l => l.label === label);
    if (!layer) return null;
    const partLabel = selections[label];
    if (!partLabel || partLabel === 'none') return null;
    const part = layer.parts.find(p => p.label === partLabel);
    return part?.image ?? null;
  };

  // Same composite order as export.js / stage z-index stacking
  return [
    getLayerImage('backgrounds'),
    bodyImage,
    getLayerImage('outfits'),
    headImage,
    getLayerImage('mouths'),
    getLayerImage('eyes'),
    getLayerImage('headgear'),
    getLayerImage('accessories'),
  ].filter(Boolean);
};

const EMPTY_SLOTS = [0, 1, 2, 3];

export const RecentSnapshots = ({ onLoad }) => {
  const snapshots = getSnapshots();

  return (
    <div className={CSS.snapshots_section}>
      <div className={CSS.snapshots_grid}>
        {EMPTY_SLOTS.map(i => {
          const snapshot = snapshots[i];
          if (!snapshot) return <div key={i} className={CSS.snapshot_thumb} />;

          const images = resolveImages(snapshot.selections);
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
