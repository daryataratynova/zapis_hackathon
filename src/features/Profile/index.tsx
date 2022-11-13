import React from "react";
import { SearchIcon, ShareIcon } from '@heroicons/react/outline';
import { Avatar } from "../../components/Avatar";
import { Input } from "../../components/Input";
import { Progress } from "../../components/Progress";
import { Stack } from "../../components/Stack";
import { Tabs } from "../../components/Tabs";
import { Toolbar } from "../../components/Toolbar";
import { Text } from "../../components/Typography";
import { useUser } from "../../hooks/useUser"
import * as htmlToImage from 'html-to-image';
import { trpc } from "../../utils/trpc";

import cls from './Profile.module.scss';
import { User } from "../User";
import { Appointment } from "../Appointment";
import { Divider } from "../../components/Divider";
import { Drawer } from "../../components/Drawer";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { Modal, ModalDescription, ModalTitle } from "../../components/Modal";
import type { Appointment as AppointmentType } from "@prisma/client";
import { Button } from "../../components/Button";
import { UserAvatar } from "../../components/UserAvatar";

export const getLevel = (xp: number) => Math.floor(xp / 300) + 1;

export const TABS = [
    {
        content: <div className={cls.tab}>Аватар</div>,
        value: "avatar",
    },
    {
        content: <div className={cls.tab}>История</div>,
        value: "appointments",
    },
    {
        content: <div className={cls.tab}>Друзья</div>,
        value: "friends",
    },
];

const COLORS = [
    "#000",
    "#2596be",
    "#be2596",
    "#e5e5e5",
    "#25be59",
]

const UserAv = () => {
    const { user: { getModifications } } = trpc.useContext();
    const { data } = trpc.user.appointments.useQuery();
    const { data: achievements } = trpc.user.achievements.useQuery();
    const { mutateAsync } = trpc.user.setNails.useMutation();
    const { data: nails } = trpc.user.getModifications.useQuery();
    const [modal, setModal] = React.useState(false);
    const [color, setColor] = React.useState(COLORS[0]!);
    const [ap, setAp] = React.useState<AppointmentType | null>(null);

    const unRecieved = React.useMemo(() => {
        if (!data) return [];
        return data.filter((appointment) => !appointment.recieved);
    }, [data]);

    React.useEffect(() => {
        if (unRecieved[0]) {
            setModal(true);
            setAp(unRecieved[0]);
        }
    }, [unRecieved]);

    const submit = React.useCallback(() => {
        if (!ap) return;
        mutateAsync({ color, id: ap.id }).then(() => {
            setModal(false);
            setAp(null);
            getModifications.invalidate();
        });
    }, [mutateAsync, color, ap, getModifications]);

    return (
        <>
            <UserAvatar modifications={nails ?? []} achievements={achievements} />
            <Modal
                open={modal}
                onOpenChange={setModal}
            >
                <ModalTitle>Вы сходили на ногти</ModalTitle>
                <ModalDescription>Теперь вы можете выбрать ногти для своего аватара</ModalDescription>
                <div className={cls.swatch}>
                    {COLORS.map((cc) => (
                        <button
                            key={cc}
                            className={cls.swatchItem}
                            style={{ backgroundColor: cc }}
                            data-selected={cc === color}
                            onClick={() => setColor(cc)}
                        />
                    ))}
                </div>
                <Button onClick={submit} fullWidth variant="primary">Сохранить</Button>
            </Modal>
        </>
    );
};

const Friends = () => {
    const { data } = trpc.user.getUsers.useQuery();

    const [search, setSearch] = React.useState("");

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

    const rows = React.useMemo(() => {
        if (!data) return [];

        if (!search) return data.users.filter(({ id }) => data.relationships.map(({ friendId }) => friendId).includes(id));

        return data.users.filter((user) => user.name?.toLowerCase().includes(search.toLowerCase()));
    }, [data, search]);

    const isFriend = React.useCallback((id: string) => {
        return data?.relationships.find(({ friendId }) => friendId === id)?.status;
    }, [data]);

    return (
        <div className={cls.friends}>
            <Stack direction="column" gap={16}>
                {data?.requests.length ? (
                    <Stack direction="column" gap={8}>
                        <Text color="secondary" bold block>Запросы</Text>
                        {data.requests.map((request) => (
                            <User key={request.id} user={request.user} request />
                        ))}
                        <Divider />
                    </Stack>
                ) : null}
                <Input
                    icon={<SearchIcon />}
                    placeholder="Поиск"
                    value={search}
                    onChange={handleChange}
                    fullWidth
                />
                <Text color="secondary" bold block>{search ? 'Поиск' : 'Друзья'}</Text>
                <Stack className={cls.friendsList} direction="column" gap={8}>
                    {rows.map((user) => (
                        <User user={user} key={user.id} isFriend={isFriend} />
                    ))}
                </Stack>
            </Stack>
        </div>
    );
}

const Appointments = () => {
    const { data } = trpc.user.appointments.useQuery();

    const rows = React.useMemo(() => {
        if (!data) return [];
        return data.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [data]);

    return (
        <div>
            <Stack direction="column" gap={16}>
                {rows.map((appointment) => (
                    <Appointment appointment={appointment} key={appointment.id} />
                ))}
            </Stack>
        </div>
    );
}

export const Profile = () => {
    const user = useUser();
    const progress = user?.xp ? ((user.xp % 300) / 300) * 100 : 0;

    const [tab, setTab] = React.useState(TABS[0]!.value);

    const onTabChange = React.useCallback((value: string) => {
        setTab(value);
    }, []);

    const onShare = React.useCallback(() => {
        const avatar = document.getElementById('avatar');
        if (!avatar) return;
        if (avatar) {
            if (!navigator.canShare) {
                htmlToImage.toPng(avatar)
                    .then(function (dataUrl) {
                        const a = document.createElement('a');
                        a.href = dataUrl;
                        a.download = "Zapis Avatar.png";
                        a.click();
                    });
                return;
            }
            htmlToImage.toBlob(avatar)
                .then(function (blob) {
                    if (!blob) return;
                    const file = new File([blob], "Zapis Avatar.png", { type: "image/png" });

                    navigator.share({
                        title: 'Zapis',
                        files: [file],
                    });
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
        }
    }, []);

    return (
        <>
            <Toolbar>
                <Text align="center" bold block>Профиль</Text>
            </Toolbar>
            <Stack direction="column" gap={16}>
                <Stack alignItems="center" gap={16}>
                    <Avatar image={user?.image} name={user?.name} />
                    <Stack direction="column">
                        <Text bold>{user?.name}</Text>
                        <Text color="secondary" size="small">{user?.email}</Text>
                    </Stack>
                    
                </Stack>
                <Stack direction="column" gap={6}>
                    <Progress value={progress} />
                    <Stack justifyContent="space-between">
                        <Text color="primary" size='small' bold>Уровень {user && getLevel(user.xp)}</Text>
                        <Text color="secondary" size='small'>{(user?.xp || 0) % 300}/300 XP</Text>
                    </Stack>
                </Stack>
                <Tabs
                    value={tab}
                    tabs={TABS}
                    onValueChange={onTabChange}
                    className={cls.tabs}
                />
            </Stack>
            {tab === 'avatar' ? (
                <div style={{
                    position: 'fixed',
                    top: 8,
                    right: 16,
                    zIndex: 10,
                }}>
                    <Button
                        variant="primary"
                        icon={<ShareIcon />}
                        onClick={onShare}
                    />
                </div>
            ) : null}
            <div className={cls.content}>
                {tab === "avatar" && <UserAv />}
                {tab === 'appointments' && <Appointments />}
                {tab === "friends" && <Friends />}
            </div>
        </>
    )
}