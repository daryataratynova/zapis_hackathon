import clsx from 'clsx';
import React from 'react';

import cls from './Button.module.scss';

type Props = React.ComponentProps<'button'> & {
    size?: 'default' | 'small';
    variant?: 'primary' | 'default' | 'link';
    icon?: React.ReactNode;
    fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, Props>((
    { children, variant = 'default', size = 'default', icon = null, className, fullWidth, ...props },
    ref,
) => (
    <button
        ref={ref}
        className={clsx(
            cls.root,
            cls[`variant-${variant}`],
            cls[`size-${size}`],
            className,
            { [cls.fullWidth!]: fullWidth },
        )}
        {...props}
    >
        {icon && (<div className={cls.icon}>{icon}</div>)}
        <span className={cls.content}>{children}</span>
    </button>
));

Button.displayName = 'Button';
