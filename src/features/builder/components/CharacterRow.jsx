import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import { getItemPositionClass, padItems } from '../services/helpers';
import { getLayerZIndex } from '../services/layers';
import { characters } from '../characters';

import CSS from './styles/CarouselRow.module.scss';

const characterLabels = Object.keys(characters);

export const CharacterRow = ({ isActive, onChange, rowPosition, bodyOverrides, hideCenterItem, selectionIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(selectionIndex);

  // Sync when the character changes from outside the row (randomize, snapshot load)
  useEffect(() => {
    if (activeIndex % characterLabels.length !== selectionIndex) {
      setActiveIndex(selectionIndex);
    }
  }, [selectionIndex]);

  const characterParts = useMemo(
    () => characterLabels.map(label => {
      const override = bodyOverrides?.[label];
      return {
        label,
        bodyImage: override?.bodyImage ?? characters[label].bodyImage,
        headImage: override?.headImage ?? characters[label].headImage,
      };
    }),
    [bodyOverrides]
  );

  const carouselItems = useMemo(
    () => padItems(characterParts),
    [characterParts]
  );

  const navigateItem = (direction) => {
    const newIndex = direction === 'left' ? (activeIndex - 1 + carouselItems.length) % carouselItems.length : (activeIndex + 1) % carouselItems.length;
    setActiveIndex?.(newIndex);
    onChange?.(newIndex % characterParts.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if(!isActive) return;
      switch (e.keyCode) {
        case 37: navigateItem('left'); break;
        case 39: navigateItem('right'); break;
        default: break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateItem, isActive]);

  return (
    <>
      <div
        className={classNames(CSS.row, isActive ? CSS.active : CSS.inactive, hideCenterItem && CSS.hide_center, rowPosition && CSS[`row_${rowPosition}`])}
        style={{ zIndex: getLayerZIndex('body') }}
      >
        { carouselItems.map((item, itemIndex) => (
          <div key={itemIndex} className={classNames(CSS.item, CSS[getItemPositionClass(itemIndex, activeIndex, carouselItems.length)])}>
            <div className={CSS.item_content}>
              { item.bodyImage && <img src={item.bodyImage} className={CSS.img} alt='' /> }
            </div>
          </div>
        ))}
      </div>
      <div
        className={classNames(CSS.row, isActive ? CSS.active : CSS.inactive, hideCenterItem && CSS.hide_center, rowPosition && CSS[`row_${rowPosition}`])}
        style={{ zIndex: getLayerZIndex('head') }}
      >
        { carouselItems.map((item, itemIndex) => (
          <div key={itemIndex} className={classNames(CSS.item, CSS[getItemPositionClass(itemIndex, activeIndex, carouselItems.length)])}>
            <div className={CSS.item_content}>
              { item.headImage && <img src={item.headImage} className={CSS.img} alt='' /> }
            </div>
          </div>
        ))}
      </div>
    </>
  );

};
