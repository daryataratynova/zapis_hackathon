import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { Toolbar } from "../components/Toolbar";
import { Text } from "../components/Typography";
import { User } from "../features/User";
import React from "react";
import { MainLayout } from "../layout/Main"
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Rating = () => {
    const { data } = trpc.user.rating.useQuery();
    const { push } = useRouter();
    const onProfileClick = React.useCallback((user_id: string) => {
        push(`/profile/${user_id}`);
    }, [push]);

    return (
        <MainLayout>
            <Toolbar>
                <Text align="center" bold block>Рейтинг</Text>
            </Toolbar>
            <Stack
                direction="column"
                gap={12}
                style={{
                    padding: '24px 0',
                }}
            >
                {data?.map((user, i) => (
                    <Stack key={user.id} alignItems="center" gap={16} onClick={() => onProfileClick(user.id)}>
                        {i === 0 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                            </svg>
                        ) : <Text style={{ width: 20, flexShrink: 0 }} align="center" color="secondary">{i + 1}.</Text>}
                        <Avatar image={user.image} name={user.name} />
                        <Text style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</Text>
                        <Text style={{ flexShrink: 0 }} size="small" bold color="primary">{user.xp} XP</Text>
                    </Stack>
                ))}
            </Stack>
        </MainLayout>
    );
}

export default Rating;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);


    if (!session) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false,

            }
        }
    }

    return {
        props: {}
    }
}
