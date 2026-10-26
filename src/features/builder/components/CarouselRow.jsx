import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import blankImage from '../characters/base/blank.png';
import { getItemPositionClass, padItems } from '../services/helpers';

import CSS from './styles/CarouselRow.module.scss';

export const CarouselRow = ({ items, isActive, order, onChange, rowPosition, selectionIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(selectionIndex);

  // Sync carousel position when an external reset occurs (e.g., an incompatible
  // selection was cleared by a character change). No-op during normal navigation
  // because onChange always keeps activeIndex % items.length === selectionIndex.
  useEffect(() => {
    if (activeIndex % items.length !== selectionIndex) {
      setActiveIndex(selectionIndex);
    }
  }, [selectionIndex, items]);

  const carouselItems = useMemo(
    () => padItems(items),
    [items]
  );

  const navigateItem = (direction) => {
    const newIndex = direction === 'left' ? (activeIndex - 1 + carouselItems.length) % carouselItems.length : (activeIndex + 1) % carouselItems.length;
    setActiveIndex?.(newIndex);
    onChange?.(newIndex % items.length);
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
    <div
      className={classNames(CSS.row, isActive ? CSS.active : CSS.inactive, rowPosition && CSS[`row_${rowPosition}`])}
      style={{ zIndex: order }}
    >
      { carouselItems.map((item, itemIndex) => (
        <div key={itemIndex} className={classNames(CSS.item, CSS[getItemPositionClass(itemIndex, activeIndex, carouselItems.length)])}>
          <div className={CSS.item_content}>
            <img
              src={blankImage}
              className={CSS.blank}
              alt='blank'
            />
            { item.image && <img src={item.image} className={CSS.img} alt='' /> }
          </div>
        </div>
      ))}
    </div>
  );
};
