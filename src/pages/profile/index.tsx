import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { Profile } from "../../features/Profile";
import { MainLayout } from "../../layout/Main";

const ProfilePage: NextPage = () => {
    return (
        <MainLayout>
           <Profile />
        </MainLayout>
    )
}

export default ProfilePage;

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
