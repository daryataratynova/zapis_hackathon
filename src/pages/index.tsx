import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { Toolbar } from "../components/Toolbar";
import { Text } from "../components/Typography";
import { MainLayout } from "../layout/Main";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
    const { push } = useRouter();
    const { mutateAsync, isLoading } = trpc.user.appointment.useMutation();

    const onAddAppointment = React.useCallback(() => {
        mutateAsync().then(() => push('/profile'));
    }, [mutateAsync, push]);

    return (
        <MainLayout>
            <Toolbar>
                <Text align="center" bold block>Главная</Text>
            </Toolbar>
            <div style={{ padding: '24px 0' }}>
                <Card>
                    <Stack alignItems="center" justifyContent="space-between" gap={8}>
                        <Stack direction="column" gap={4}>
                            <Text bold>Ноготочки</Text>
                            <Text size="small" color="secondary">Кабанбай батыра 53</Text>
                        </Stack>
                        <Button disabled={isLoading} onClick={onAddAppointment} variant="primary">Записаться</Button>
                    </Stack>
                </Card>
            </div>
        </MainLayout>
    )
}

export default Home;

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