import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import CreateMessageBox from "./create-message-box";
import MessagesHistory from "./messages-history";
import "./styles.scss";

interface IRandChatProps {
    gaduka: Gaduka;
    branch: "/anon/rand" | "/auth/rand";
}

interface IParticipantState {
    available: boolean;
    nickname?: string;
}

const RandChat: React.FunctionComponent<IRandChatProps> = (props) => {
    const [participantState, setParticipantState] = useState<IParticipantState>({ available: false });
    const isAuthorized = props.gaduka.isLoggedIn() || props.branch === "/anon/rand";
    const isDisabled = !participantState.available || !isAuthorized;

    useEffect(() => {
        const lostParticipantCallback = () => setParticipantState({ available: false });
        const newParticipantCallback = (nickname?: string) => {
            if (nickname) {
                setParticipantState({ available: true, nickname });
            } else {
                setParticipantState({ available: true });
            }
        };

        props.gaduka.on("new_participant", newParticipantCallback);
        props.gaduka.on("lost_participant", lostParticipantCallback);

        return () => {
            props.gaduka.off("new_participant", newParticipantCallback);
            props.gaduka.off("lost_participant", lostParticipantCallback);
        }
    });

    return (
        <div className="chat-content">
            <p className="chat-name">{window.location.pathname}</p>
            <div className="chat-box">
                <p className={"participant-status" + (participantState.nickname !== undefined ? " with-nickname" : "")}>
                    {
                        participantState.available
                            ? (participantState.nickname ? participantState.nickname : "Собеседник найден")
                            : "Поиск собеседника..."
                    }
                </p>
                <MessagesHistory gaduka={props.gaduka} />
                <CreateMessageBox branch={props.branch} gaduka={props.gaduka} disabled={isDisabled} />
            </div>
        </div>
    )
}

export default RandChat;