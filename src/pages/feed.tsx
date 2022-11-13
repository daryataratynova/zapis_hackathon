import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { Feed } from "../features/Feed";
import { MainLayout } from "../layout/Main";

const FeedPage: NextPage = () => {
    return (
        <MainLayout>
           <Feed />
        </MainLayout>
    )
}

export default FeedPage;

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