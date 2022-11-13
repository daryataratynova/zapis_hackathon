import { trpc } from "../utils/trpc";

export const useUser = () => {
    const { data } = trpc.auth.getUser.useQuery();

    return data;
}
