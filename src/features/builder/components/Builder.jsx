import { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { characters } from '../characters';
import { generateAvatar } from '../services/export';
import { saveSnapshot } from '../services/snapshots';
import { Stage } from './Stage';
import { CharacterRow } from './CharacterRow';
import { BodyRow } from './BodyRow';
import { CarouselRow } from './CarouselRow';
import { RecentSnapshots } from './RecentSnapshots';
import CSS from './styles/Builder.module.scss';

// Returns 'center' | 'previous' | 'next' | 'hidden' — used as CSS key and rowPosition prop.
const getLayerPosition = (layerIndex, activeLayerIndex, n) => {
  let rel = ((layerIndex - activeLayerIndex) % n + n) % n;
  if (rel > Math.floor(n / 2)) rel -= n;
  switch (rel) {
    case  0: return 'center';
    case  1: return 'next';
    case -1: return 'previous';
    default: return 'hidden';
  }
};

const buildInitialSelections = (classLabel) => ({
  character: classLabel,
  body: 'default',
  ...characters[classLabel].layers.reduce((layers, layer) => ({
    ...layers,
    [layer.label]: layer.parts[0].label,
  }), {}),
});

export const Builder = () => {
  const [selections, setSelections] = useState(buildInitialSelections('human'));
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [snapshotVersion, setSnapshotVersion] = useState(0);

  const currentCharacter = characters[selections.character];
  const hasMultipleBodies = currentCharacter.bodies.length > 1;

  const layers = useMemo(
    () => ([
      { label: 'character', isCharacterLayer: true, parts: Object.keys(characters).map(label => ({ label })) },
      ...(hasMultipleBodies ? [{ label: 'body', isBodyLayer: true, parts: currentCharacter.bodies }] : []),
      ...currentCharacter.layers,
    ]),
    [selections.character, hasMultipleBodies]
  );

  const navigateLayers = useCallback((direction) => {
    const length = layers.length;
    setActiveLayerIndex(prev => direction === 'up' ? (prev - 1 + length) % length : (prev + 1) % length);
  }, [layers.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.keyCode) {
        case 38: e.preventDefault(); navigateLayers('up'); break;
        case 40: e.preventDefault(); navigateLayers('down'); break;
        default: break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateLayers]);

  const onChangeSelection = (layer, index) => {
    if (layer.label === 'character') {
      const newCharacterLabel = layer.parts[index].label;
      const newLayers = characters[newCharacterLabel].layers;
      setSelections(prev => {
        const next = { ...prev, character: newCharacterLabel, body: 'default' };
        newLayers.forEach(newLayer => {
          const validLabels = new Set(newLayer.parts.map(p => p.label));
          if (!validLabels.has(prev[newLayer.label])) {
            next[newLayer.label] = 'none';
          }
        });
        return next;
      });
    } else if (layer.label === 'body') {
      setSelections(prev => ({
        ...prev,
        body: layer.parts[index].label,
      }));
    } else {
      setSelections(prev => ({
        ...prev,
        [layer.label]: layer.parts[index].label,
      }));
    }
  };

  // Override the selected character's body/head images based on current body selection
  const bodyOverrides = useMemo(() => {
    const selectedBody = currentCharacter.bodies.find(b => b.label === selections.body);
    if (!selectedBody) return {};
    return {
      [selections.character]: {
        bodyImage: selectedBody.bodyImage,
        headImage: selectedBody.headImage,
      },
    };
  }, [selections.character, selections.body, currentCharacter.bodies]);

  // Find the body layer index and selection index for BodyRow
  const bodyLayerIndex = hasMultipleBodies ? 1 : -1;
  const bodySelectionIndex = hasMultipleBodies
    ? Math.max(0, currentCharacter.bodies.findIndex(b => b.label === selections.body))
    : 0;

  return (
    <div className={CSS.builder}>

      {/* Layer title — vertical mini carousel */}
      <div className={CSS.title_carousel}>
        {layers.map((layer, layerIndex) => (
          <div
            key={layer.label}
            className={classNames(CSS.title_item, CSS[getLayerPosition(layerIndex, activeLayerIndex, layers.length)])}
          >
            {layer.label}
          </div>
        ))}
      </div>

      {/*
        interaction_area: stage_card in normal flow provides height.
        CarouselRows are absolutely positioned over the stage area, each at
        its layer's z-index. stage_card has no z-index so it doesn't create
        a stacking context — rows interleave correctly with the white background.
      */}
      <div className={CSS.interaction_area}>
        <CharacterRow
          isActive={activeLayerIndex === 0}
          onChange={partIndex => onChangeSelection(layers[0], partIndex)}
          rowPosition={getLayerPosition(0, activeLayerIndex, layers.length)}
          bodyOverrides={bodyOverrides}
          hideCenterItem={hasMultipleBodies && activeLayerIndex !== 0}
        />
        { hasMultipleBodies && (
          <BodyRow
            bodies={currentCharacter.bodies}
            isActive={activeLayerIndex === bodyLayerIndex}
            onChange={partIndex => onChangeSelection(layers[bodyLayerIndex], partIndex)}
            rowPosition={getLayerPosition(bodyLayerIndex, activeLayerIndex, layers.length)}
            selectionIndex={bodySelectionIndex}
            hideCenterItem={activeLayerIndex === 0}
          />
        )}
        { layers.map((layer, layerIndex) => (
          !layer.isCharacterLayer && !layer.isBodyLayer && (
            <CarouselRow
              key={layer.label}
              items={layer.parts}
              isActive={layerIndex === activeLayerIndex}
              onChange={partIndex => onChangeSelection(layer, partIndex)}
              order={layer.order}
              rowPosition={getLayerPosition(layerIndex, activeLayerIndex, layers.length)}
              selectionIndex={Math.max(0, layer.parts.findIndex(p => p.label === selections[layer.label]))}
            />
          )
        ))}
        <div className={CSS.stage_card}>
          <Stage />
          {/* <div className={CSS.snapshot_btn} onClick={() => { saveSnapshot(selections); setSnapshotVersion(v => v + 1); }}>+ create snapshot</div> */}
        </div>

      </div>

      <button className={CSS.create_btn} onClick={() => generateAvatar(selections, characters)}>create me</button>

      {/* <RecentSnapshots key={snapshotVersion} onLoad={(s) => { setSelections(s); }} /> */}

    </div>
  );
};
