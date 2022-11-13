import { Card } from "../../components/Card";
import { Stack } from "../../components/Stack";
import { Toolbar } from "../../components/Toolbar";
import { Text } from "../../components/Typography";
import { trpc } from "../../utils/trpc";
import { Appointment } from "../Appointment";
import { User } from "../User";

export const Feed = () => {
    const { data } = trpc.user.feed.useQuery();

    return (
        <div>
            <Toolbar>
                <Text align="center" bold block>Лента</Text>
            </Toolbar>
            <Stack
                direction="column"
                gap={12}
                style={{
                    padding: '24px 0',
                }}
            >
                {data?.map((appointment) => (
                    <Card key={appointment.id}>
                        <Stack direction="column" gap={16}>
                            <User user={appointment.user} />
                            <Text size="small" color="secondary">Посетил услугу:</Text>
                            <Appointment appointment={appointment} showXp={false} />
                        </Stack>
                    </Card>
                ))}
            </Stack>
        </div>
    );
};
