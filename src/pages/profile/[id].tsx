import { GetServerSideProps, type NextPage } from "next";
import { useRouter } from "next/router";
import { Toolbar } from "../../components/Toolbar";
import { Avatar } from "../../components/Avatar";
import { Stack } from "../../components/Stack";
import { Progress } from "../../components/Progress";
import { Text } from "../../components/Typography";
import { useUser } from "../../hooks/useUser"
import { trpc } from "../../utils/trpc";

import { getLevel } from "../../features/Profile";
import { UserAvatar } from "../../components/UserAvatar";
import { MainLayout } from "../../layout/Main";
import { Divider } from "../../components/Divider";
import { Button } from "../../components/Button";
import { User } from "../../features/User";
import React from "react";
import { getSession } from "next-auth/react";


const UserPage: NextPage = () => {
    const { query, push } = useRouter();
    const id = query.id as string;
    const user = useUser();

    const { data } = trpc.user.getProfile.useQuery({ id }, {
        onError: () => push('/profile'),
    });

    React.useEffect(() => {
        if (user?.id === id) {
            push('/profile');
        }
    }, [user, push, id])

    const isFriend = React.useCallback((id: string) => {
        return data?.relationships.find(({ friendId }) => friendId === id)?.status;
    }, [data]);

    const progress = data?.user?.xp ? ((data?.user.xp % 300) / 300) * 100 : 0;

    return (
        <MainLayout>
            <Toolbar>
                <Text align="center" bold block>Профиль</Text>
            </Toolbar>
            <Toolbar>
                <Stack direction="column" gap={16}>
                    <Stack alignItems="center" gap={16}>
                        {data ? <User user={data.user} isFriend={isFriend} /> : null}
                    </Stack>
                    <Stack direction="column" gap={6}>
                        <Progress value={progress} />
                        <Stack justifyContent="space-between">
                            <Text color="primary" size='small' bold>Уровень {data?.user && getLevel(data?.user.xp)}</Text>
                            <Text color="secondary" size='small'>{(data?.user?.xp || 0) % 300}/300 XP</Text>
                        </Stack>
                    </Stack>

                </Stack>
            </Toolbar>
            <Stack grow={1} alignItems="center">
                <UserAvatar modifications={data?.modifications ?? []} achievements={data?.achievement} />
            </Stack>
        </MainLayout>
    )
}

export default UserPage;

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