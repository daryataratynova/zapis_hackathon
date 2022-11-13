import clsx from 'clsx';
import React from 'react';

import cls from './Toolbar.module.scss';

export const Toolbar: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => (
    <div className={clsx(className, cls.root)} {...props} />
);
