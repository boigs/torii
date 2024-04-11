'use client';

import { ReactNode } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import classNames from 'classnames';

const AnimatedParent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className={classNames([className])}>
      {children}
    </div>
  );
};

export default AnimatedParent;
