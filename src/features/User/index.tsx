import type { Relationship, User as UserType } from "@prisma/client";
import React from "react";
import { trpc } from "../../utils/trpc";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { Stack } from "../../components/Stack";
import { Text } from "../../components/Typography";

import cls from './User.module.scss';
import { useRouter } from "next/router";

interface Props {
    user: UserType;
    isFriend?: (id: string) => Relationship['status'] | undefined;
    request?: boolean;
}

export const User: React.FC<Props> = ({ user, isFriend, request }) => {
    const { id, name, image } = user;
    const { user: { getUsers, getProfile } } = trpc.useContext();

    const { push } = useRouter();

    const { mutateAsync: add, isLoading: addLoading } = trpc.user.addFriend.useMutation({
        onSuccess: () => {
            getUsers.invalidate();
            getProfile.invalidate();
        }
    });

    const { mutateAsync: accept, isLoading: acceptLoading } = trpc.user.acceptFriend.useMutation({
        onSuccess: () => {
            getUsers.invalidate();
        }
    });

    const isLoading = addLoading || acceptLoading;

    const onAddFriend = React.useCallback(() => {
        add({ id });
    }, [add, id]);

    const onAccept = React.useCallback(() => {
        accept({ id });
    }, [accept, id]);

    const button = React.useMemo(() => {
        if (request) return <Button disabled={isLoading} onClick={onAccept}>Accept</Button>;
        if (!isFriend) return null;
        if (isFriend?.(id) === 'ACCEPTED') return <Button variant="primary" disabled>Друзья</Button>;
        if (isFriend?.(id) === 'PENDING') return <Button variant="link" disabled>В ожидании</Button>;
        if (isLoading) return <Button disabled>Loading...</Button>;
        return <Button onClick={onAddFriend}>Add Friend</Button>;
    }, [isFriend, id, isLoading, onAddFriend, onAccept, request]);

    const toProfile = React.useCallback(() => {
        push(`/profile/${id}`);
    }, [push, id]);

    return (
        <Stack fullWidth alignItems="center" gap={12}>
            <Avatar onClick={toProfile} image={image} name={name} />
            <Text onClick={toProfile} className={cls.text}>{name}</Text>
            {button}
        </Stack>
    );
};