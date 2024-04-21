'use client';

import { ReactNode } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import classNames from 'classnames';

interface AnimatedParentProps {
  children: ReactNode;
  className?: string;
}

const AnimatedParent = ({ children, className }: AnimatedParentProps) => {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className={classNames([className])}>
      {children}
    </div>
  );
};

export default AnimatedParent;
