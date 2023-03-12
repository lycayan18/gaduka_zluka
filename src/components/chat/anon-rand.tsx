import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import CreateMessageBox from "./create-message-box";
import MessagesHistory from "./messages-history";
import "./styles.scss";

interface IAnonRandChatProps {
    gaduka: Gaduka;
}

const AnonRandChat: React.FunctionComponent<IAnonRandChatProps> = (props) => {
    const [participantAvailable, setParticipantAvailabilityState] = useState<boolean>(false);

    useEffect(() => {
        const lostParticipantCallback = () => setParticipantAvailabilityState(false);
        const newParticipantCallback = () => setParticipantAvailabilityState(true);

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
                <p className="participant-status">
                    {
                        participantAvailable
                            ? "Собеседник найден"
                            : "Поиск собеседника..."
                    }
                </p>
                <MessagesHistory gaduka={props.gaduka} />
                <CreateMessageBox branch="/anon/rand" gaduka={props.gaduka} disabled={!participantAvailable} />
            </div>
        </div>
    )
}

export default AnonRandChat;