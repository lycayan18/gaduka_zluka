import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import MessageType from "../../contracts/components/message-displayer/message-type";
import UIMessage from "./ui-message";
import "./styles.scss";

interface IMessageDisplayerProps {
    gaduka: Gaduka;
}

interface IMessage {
    type: MessageType;
    message: string;
}

interface IMessageDisplayerState {
    messages: Array<IMessage>;
}

const MessageDisplayer: React.FunctionComponent<IMessageDisplayerProps> = (props) => {
    const [{ messages }, setMessages] = useState<IMessageDisplayerState>({
        messages: []
    });

    useEffect(() => {
        const addMessage = (message: string, type: MessageType) => {
            setMessages({
                messages: messages.concat({
                    type,
                    message
                })
            });
        }

        props.gaduka.on("ui_message", addMessage);

        return () => props.gaduka.off("ui_message", addMessage);
    });

    const removeMessage = (message: IMessage) => {
        const index = messages.indexOf(message);

        if (index > -1) {
            setMessages({
                messages: messages.slice(0, index).concat(messages.slice(index + 1))
            });
        }
    }

    return (
        <div className="messages-container">
            {
                messages.map((message, index) => (
                    <UIMessage type={message.type} message={message.message} key={index} onClose={() => removeMessage(message)} />
                ))
            }
        </div>
    )
}

export default MessageDisplayer;