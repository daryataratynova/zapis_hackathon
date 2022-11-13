import type { Achievement as AchievementType, Modification } from "@prisma/client";
import React from "react";
import { Achievement } from "../Achievement";
import { Divider } from "../Divider";
import { Text } from "../Typography";
import cls from './UserAvatar.module.scss';

interface Props {
    modifications: Modification[];
    achievements?: AchievementType[];
}

const Nails = () => (
    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M454.256 421L461.596 423.391C463.25 423.93 464.555 424.811 465.511 425.456C465.685 425.574 465.849 425.684 466 425.783C462.969 426.629 457.794 424.78 455.827 424.077C455.571 423.986 455.37 423.914 455.234 423.87C454.06 423.487 453.936 421.797 454.021 421H454.256ZM472.704 423.575L465.329 421.004L465.093 421C464.996 421.822 465.096 423.569 466.276 423.981C466.412 424.028 466.615 424.105 466.872 424.203C468.846 424.956 474.044 426.938 477.115 426.106C476.963 426.002 476.8 425.886 476.626 425.762C475.671 425.083 474.366 424.155 472.704 423.575ZM440.869 443.07C441.809 441.675 437.393 436.002 436.641 435.63C435.701 435.165 433.822 435.165 433.352 436.095C432.883 437.025 432.883 437.955 433.352 439.35C433.471 439.703 439.46 444.464 440.869 443.07ZM49.9221 438.979L42.0362 439.539C40.2586 439.665 38.7384 440.226 37.6256 440.637L37.6254 440.637L37.625 440.637L37.6248 440.637C37.4214 440.712 37.2317 440.782 37.0564 440.843C38.9652 441.96 42.2046 442.046 44.7366 441.921L44.5 442C42.8094 442.564 41.4761 443.484 40.5 444.158C40.3214 444.282 40.1547 444.397 40 444.5C43.0966 445.385 48.385 443.451 50.394 442.717L50.3941 442.717C50.6557 442.621 50.8617 442.546 51 442.5C52.2 442.1 52.3262 440.333 52.2393 439.5H52L49.8037 440.232C49.995 439.801 50.1068 439.357 50.1539 439.039L49.9221 438.979ZM71.1389 462.328C70.1389 460.828 74.8389 454.728 75.6389 454.328C76.6389 453.828 78.6389 453.828 79.1389 454.828C79.6389 455.828 79.6389 456.828 79.1389 458.328C79.0124 458.708 72.6389 463.828 71.1389 462.328Z" fill="currentColor" />
    </svg>
);

const getOpacity = (modification: Modification) => {
    const { date } = modification;

    const now = new Date();

    const diff = now.getTime() - date.getTime();

    const seconds = diff / 1000;

    if (seconds < 20) {
        return 1;

    } else if (seconds < 40) {
        return 0.6;

    } else if (seconds < 60) {
        return 0.4;

    } else if (seconds < 80) {
        return 0.2;

    } else if (seconds < 100) {
        return 0.1;

    } else {
        return 0;
    }

};

export const UserAvatar: React.FC<Props> = ({ modifications, achievements }) => {
    const [tick, setTick] = React.useState(false);

    const tickTack = React.useCallback(() => setTick(t => !t), []);

    React.useEffect(() => {
        const int = setInterval(() => {
            console.log('tick');
            tickTack();
        }, 1000);

        return () => clearInterval(int);
    }, [tickTack]);

    return (
        <div>
            <div id="avatar" data-tick={tick} className={cls.avatar}>
                <img className={cls.img} src="/avatar.svg" />
                {modifications?.map((nail) => (
                    <div
                        key={nail.id}
                        className={cls.nails}
                        style={{
                            color: nail.color,
                            opacity: getOpacity(nail),
                        }}
                    >
                        <Nails />
                    </div>
                ))}
            </div>
            <Divider />
            <Text color="secondary" bold size="small">Достижения</Text>
            <div className={cls.achievements}>
                {achievements?.map((achievement) => (
                    <Achievement key={achievement.id} name={achievement.name} date={achievement.date} />
                ))}
            </div>
        </div>
    )
}