import React from 'react';
import classNames from 'classnames';

import CSS from './Modal.module.scss';

export const Modal = ({ children, options, id, close }) => {
  const { hideCloseButton, customStyles, theme = false } = options;
  return (
    <div id={id} className={classNames(CSS.window, CSS.in)}>
      <div className={classNames(CSS.modal, { [CSS[theme]]: theme })} style={customStyles}>
        { !hideCloseButton &&
          (<div className={CSS.close} onClick={() => close(false)}>&times;</div>)
        }
        { children }
      </div>
    </div>
  );
};
