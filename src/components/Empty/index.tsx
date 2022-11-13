import { InboxIcon } from '@heroicons/react/solid';
import React, { ReactNode } from 'react';

import { Stack } from '../Stack';
import { Text } from '../Typography';

import cls from './Empty.module.scss';

export const Empty: React.FC<{ children?: ReactNode }> = ({ children = 'Empty' }) => (
    <Stack minHeight={200} className={cls.root} alignItems="center" justifyContent="center" direction="column" gap={8}>
        <InboxIcon height={24} width={24} />
        <Text size="small">{children}</Text>
    </Stack>
);
