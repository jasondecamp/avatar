import React from 'react';
import PropTypes from 'prop-types';

import logo from './logo.svg';
import CSS from './Icon.module.scss';

/**
 * Primary React Logo Icon
 */
export const Icon = ({ size, className, onClick }) => {
  return (
    <img
      alt="logo"
      src={logo}
      className={[CSS[size],className,CSS.icon].filter(v=>v).join(' ')}
      onClick={onClick}
    />
  );
};

Icon.propTypes = {
  /**
   * How large should the icon be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  size: 'medium',
  onClick: undefined,
};
