import Avatar from "boring-avatars";
import React from "react";
import { Stack } from "../Stack";
import { Text } from "../Typography";

interface Props {
    name: string;
    date: Date;
}

export const Achievement: React.FC<Props> = ({ name, date }) => {
    const dateText = React.useMemo(() => {
        const d = date;
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    }, [date]);
    return (
        <Stack direction="column" alignItems="center" justifyContent="center" gap={8}>
            <Avatar size={96} name={name} />
            <Text bold>{name}</Text>
            <Text size="small" color="secondary">{dateText}</Text>
        </Stack>
    )
}