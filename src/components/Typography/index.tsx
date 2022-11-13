import clsx from 'clsx';
import React from 'react';

import cls from './Typography.module.scss';

interface TextProps {
    size?: 'small' | 'default' | 'large';
    color?: 'default' | 'primary' | 'secondary';
    type?: 'default' | 'primary';
    align?: 'left' | 'center';
}

export const Text: React.FC<React.ComponentProps<'span'> & TextProps & { block?: boolean, bold?: boolean }> = ({ className, size = 'default', color = 'default', align = 'left', type = 'default', block, bold, ...props }) => (
    <span className={clsx(className, cls[`size-${size}`], cls[`color-${color}`], cls[`type-${type}`], cls[`align-${align}`], { [cls.block!]: block, [cls.bold!]: bold })} {...props} />
);

export const Paragraph: React.FC<React.ComponentProps<'p'> & TextProps> = ({ className, size = 'default', color = 'default', align = 'left', type = 'default', ...props }) => (
    <p className={clsx(className, cls[`size-${size}`], cls[`color-${color}`], cls[`type-${type}`], cls[`align-${align}`])} {...props} />
);
