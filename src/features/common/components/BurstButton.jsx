import { useState } from 'react';
import classNames from 'classnames';

import { Burst } from './Burst';
import CSS from './styles/BurstButton.module.scss';

// A button that plays a Burst on every click. Each click remounts the Burst under a new key,
// which restarts its animation. Other props, including aria-* from Tooltip.Trigger, go to the button.
export const BurstButton = ({ children, className, onClick, ...props }) => {
  const [clicks, setClicks] = useState(0);

  const handleClick = (event) => {
    setClicks(count => count + 1);
    onClick?.(event);
  };

  return (
    <button type='button' {...props} className={classNames(CSS.button, className)} onClick={handleClick}>
      {children}
      {clicks > 0 && <Burst key={clicks} />}
    </button>
  );
};
