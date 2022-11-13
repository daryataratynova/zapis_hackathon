import * as ProgressBase from '@radix-ui/react-progress';
import React from 'react';
import cls from './Progress.module.scss';

export const Progress: React.FC<ProgressBase.ProgressProps> = ({ value, ...props }) => (
    <ProgressBase.Root className={cls.root} value={value} {...props}>
        <ProgressBase.Indicator style={{
            transform: `scaleX(${(value ?? 0) / 100})`,
        }} className={cls.bar} />
    </ProgressBase.Root>
);