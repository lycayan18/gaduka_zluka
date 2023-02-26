import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import IBaseChatMessage from "../../contracts/base-chat-message";
import Message from "./message";
import "./styles.scss";

interface IMessagesHistoryProps {
    gaduka: Gaduka;
}

const MessagesHistory: React.FunctionComponent<IMessagesHistoryProps> = (props) => {
    const [history, setHistory] = useState<IBaseChatMessage[]>(props.gaduka.getChatHistory());

    useEffect(() => {
        const handleMessages = (messages: IBaseChatMessage[]) => {
            // FIXME: remove this
            for (const message of messages) {
                console.log("onmessage:", message.text, "from", message.author, "at", message.date, "in", message.branch);
            }

            // Save chat history in reverse order so new messages appear below old ones in the rendered DOM
            setHistory([...messages.reverse(), ...history]);
        }

        props.gaduka.on("message", handleMessages);

        return () => props.gaduka.off("message", handleMessages);
    });

    return (
        <div className="chat-history">
            {
                // TODO: With deleting messages functionality added, let the key be message id instead of array index
                history.map((message, index) => (
                    <Message from={message.author} date={message.date} text={message.text} key={index} />
                ))
            }
        </div>
    )
}

export default MessagesHistory;