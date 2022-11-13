import clsx from 'clsx';
import React, { type CSSProperties, type HTMLAttributes } from 'react';

import cls from './Stack.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  direction?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  gap?: number;
  grow?: CSSProperties['flexGrow'];
  fullWidth?: boolean;
  wrap?: boolean;
  minHeight?: number;
}

export const Stack = React.forwardRef<HTMLDivElement, Props>(
  ({ className, direction = 'row', alignItems = 'stretch', justifyContent = 'start', gap = 0, grow = 'unset', fullWidth, wrap, minHeight, ...props }, ref) => (
    <>
      <style jsx>{`
      div {
        flex-direction: ${direction};
        align-items: ${alignItems};
        justify-content: ${justifyContent};
        gap: ${gap}px;
        flex-grow: ${grow};
        flex-wrap: ${wrap ? 'wrap' : 'unset'};
        min-height: ${minHeight ? `${minHeight}px` : 'unset'}
      }
    `}</style>
      <div
        className={clsx(className, cls.root, {
          [cls.fullWidth!]: fullWidth,
        })}
        {...props}
        ref={ref}
      />
    </>
  )
);

Stack.displayName = 'Stack';
