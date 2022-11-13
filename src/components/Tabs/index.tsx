import React from 'react';
import * as TabsBase from '@radix-ui/react-tabs';
import clsx from 'clsx';

import cls from './Tabs.module.scss';

interface Props extends TabsBase.TabsProps {
    tabs: { value: string; content: React.ReactNode }[];
}

export const Tabs: React.FC<Props> = ({ tabs, className, ...props }) => {
    return (
        <TabsBase.Root className={clsx(cls.root, className)} {...props}>
            <TabsBase.List className={cls.list}>
                {tabs.map(({ value, content }) => (
                    <TabsBase.Trigger value={value} className={cls.trigger} key={value}>
                        {content}
                    </TabsBase.Trigger>
                ))}
            </TabsBase.List>
        </TabsBase.Root>
    )
};
