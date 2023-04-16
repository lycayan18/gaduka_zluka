import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import ChatBox from "./chat-box";
import "./styles.scss";

interface IRandChatProps {
    gaduka: Gaduka;
    branch: "/anon/rand" | "/auth/rand";
}

interface IParticipantState {
    available: boolean;
    nickname?: string;
    isAuthorized: boolean;
}

const RandChat: React.FunctionComponent<IRandChatProps> = (props) => {
    const isAuthorized = props.gaduka.isLoggedIn() || props.branch === "/anon/rand";
    const [participantState, setParticipantState] = useState<IParticipantState>({ available: false, isAuthorized });
    const isDisabled = !participantState.available || !isAuthorized;

    useEffect(() => {
        const onLogInCallback = () => setParticipantState({ available: false, isAuthorized: true });

        if (!isAuthorized) {
            props.gaduka.on("user_data", onLogInCallback);
        }

        const lostParticipantCallback = () => setParticipantState({ available: false, isAuthorized: participantState.isAuthorized });
        const newParticipantCallback = (nickname?: string) => {
            if (nickname) {
                setParticipantState({ available: true, nickname, isAuthorized: participantState.isAuthorized });
            } else {
                setParticipantState({ available: true, isAuthorized: participantState.isAuthorized });
            }
        };

        props.gaduka.on("new_participant", newParticipantCallback);
        props.gaduka.on("lost_participant", lostParticipantCallback);

        return () => {
            props.gaduka.off("new_participant", newParticipantCallback);
            props.gaduka.off("lost_participant", lostParticipantCallback);
            props.gaduka.off("user_data", onLogInCallback);
        }
    });

    const participantStatus =
        isAuthorized
            ? participantState.available
                ? participantState.nickname
                    ? `Собеседник: ${participantState.nickname}`
                    : "Собеседник найден"
                : "Поиск собеседника..."
            : "Вы не вошли в аккаунт";

    return (
        <div className="chat-content">
            <div className="chat-box">
                <p className={"participant-status" + (participantState.nickname !== undefined ? " with-nickname" : "")}>
                    {participantStatus}
                </p>
                <ChatBox branch={props.branch} gaduka={props.gaduka} showAdminTools={false} disabled={isDisabled} />
            </div>
        </div>
    )
}

export default RandChat;