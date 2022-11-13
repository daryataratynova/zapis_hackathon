import React from 'react';
import * as AvatarBase from '@radix-ui/react-avatar';

import cls from './Avatar.module.scss';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    image?: string | null;
    name?: string | null;
    size?: 'small' | 'medium' | 'large';
}

const getInitials = (name: string) => name.split(' ').map((n) => n[0]!.toUpperCase() || '').join('');

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
    ({
        image,
        name,
        size = 'medium',
        ...props
    }, ref) => (
        <AvatarBase.Root
            className={cls.root}
            data-size={size}
            ref={ref}
            {...props}
        >
            <AvatarBase.Image
                src={image ?? undefined}
                alt={name ?? undefined}
                className={cls.image}
            />
            <AvatarBase.Fallback className={cls.fallback}>
                {name && getInitials(name)}
            </AvatarBase.Fallback>
        </AvatarBase.Root>
    ));

Avatar.displayName = 'Avatar';
