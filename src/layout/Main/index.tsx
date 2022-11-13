import React from "react";
import { HomeIcon, ClipboardListIcon, UserIcon, StarIcon } from '@heroicons/react/outline'
import { useRouter } from "next/router";
import { Stack } from "../../components/Stack";
import { Tabs } from "../../components/Tabs";

import cls from './Main.module.scss';

const ROUTES = {
    'home': {
        icon: <HomeIcon />,
        path: '/',
        label: 'Главная'
    },
    'rating': {
        icon: <StarIcon />,
        path: '/rating',
        label: 'Рейтинг',
    },
    'feed': {
        icon: <ClipboardListIcon />,
        path: '/feed',
        label: 'Лента',
    },
    'profile': {
        icon: <UserIcon />,
        path: '/profile',
        label: 'Профиль',
    },
} as const;

type Routes = keyof typeof ROUTES;

export const MainLayout: React.FC<React.ComponentProps<'div'>> = ({ children }) => {
    const { push, pathname } = useRouter();
    const [value, setValue] = React.useState<Routes>(() => {
        const route = Object.keys(ROUTES).find((route) => ROUTES[route as Routes].path === pathname);
        return route as Routes;
    });

    const handleChange = React.useCallback((value: string) => {
        const route = value as Routes;
        push(ROUTES[route].path);
        setValue(route);
    }, [push]);

    return (
        <Stack
            direction="column"
            className={cls.root}
        >
            <Stack className={cls.children} grow={1} direction="column" alignItems="stretch">
                {children}
            </Stack>
            <Tabs
                style={{
                    flexShrink: 0,
                }}
                className={cls.tabs}
                value={value}
                onValueChange={handleChange}
                tabs={Object.keys(ROUTES).map((route) => ({
                    value: route,
                    content: (
                        <Stack className={cls.tab} direction="column" alignItems="center" gap={4}>
                            {ROUTES[route as Routes].icon}
                            <span>{ROUTES[route as Routes].label}</span>
                        </Stack>
                    )
                }))}
            />
        </Stack>
    )
}