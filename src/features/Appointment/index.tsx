import type { Appointment as AppointmentType } from "@prisma/client";
import React from "react";
import { Card } from "../../components/Card";
import { Stack } from "../../components/Stack";
import { Text } from "../../components/Typography";

interface Props {
    appointment: AppointmentType;
    showXp?: boolean;
}

export const Appointment: React.FC<Props> = ({ appointment, showXp = true }) => {
    const date = React.useMemo(() => {
        const d = appointment.date;
        return `${d.getDate()}.${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`;
    }, [appointment]);
    return (
        <Card>
            <Stack alignItems="center" justifyContent="space-between" gap={8}>
                <Stack direction="column" gap={4}>
                    <Text bold>Ноготочки</Text>
                    <Text size="small" color="secondary">Кабанбай батыра 53, {date}</Text>
                </Stack>
                {showXp ? <Text style={{ whiteSpace: 'nowrap' }} bold size="small" color="primary">+ 110 XP</Text> : null}
            </Stack>
        </Card>
    )
}