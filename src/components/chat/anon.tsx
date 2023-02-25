import React, { useState, useEffect, useRef } from "react";
import Message from "./message";
import Gaduka from "../../gaduka";
import "./styles.scss";
import IBaseChatMessage from "../../contracts/base-chat-message";
import CreateMessageBox from "./create-message-box";

interface IChatProps {
    gaduka: Gaduka;
}

interface IChatState {
    history: IBaseChatMessage[];
}

const AnonChat: React.FunctionComponent<IChatProps> = (props: IChatProps) => {
    const [{ history }, setChatHistory] = useState<IChatState>({ history: props.gaduka.getChatHistory() });

    useEffect(() => {
        function handleMessages(messages: IBaseChatMessage[]) {
            // FIXME: remove this
            for (const message of messages) {
                console.log("onmessage:", message.text, "from", message.author, "at", message.date, "in", message.branch);
            }

            setChatHistory({
                // Save chat history in reverse order so new messages appear below old ones in the rendered DOM
                history: [...messages.reverse(), ...history]
            });
        }

        props.gaduka.on("message", handleMessages);

        return () => {
            props.gaduka.off("message", handleMessages);
        }
    });

    return (
        <div className="chat-content">
            <p className="chat-name">{window.location.pathname}</p>
            <div className="chat-box">
                <div className="chat-history">
                    {
                        // TODO: With deleting messages functionality added, let the key be message id instead of array index
                        history.map((message, index, array) => (
                            <Message from={message.author} date={message.date} text={message.text} key={index} />
                        ))
                    }
                </div>
                <CreateMessageBox branch="/anon" gaduka={props.gaduka} />
            </div>
        </div>
    )
}

export default AnonChat;