import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import IBaseChatMessage from "../../contracts/base-chat-message";
import Message from "./message";
import "./styles.scss";
import Branch from "../../contracts/branch";

interface IMessagesHistoryProps {
    gaduka: Gaduka;
    branch: Branch;
    showIps?: boolean;
}

const MessagesHistory: React.FunctionComponent<IMessagesHistoryProps> = (props) => {
    const [history, setHistory] = useState<IBaseChatMessage[]>(props.gaduka.getChatHistory());

    const adminNicknames = props.gaduka.getAdminNicknames();

    useEffect(() => {
        const handleMessages = (messages: IBaseChatMessage[]) => {
            // Filter messages not from this branch
            const branchMessages = messages.filter(message => message.branch === props.branch);

            // Don't update if all messages are from other branches
            if (branchMessages.length === 0) {
                return;
            }

            // Save chat history in reverse order so new messages appear below old ones in the rendered DOM
            setHistory([...branchMessages.reverse(), ...history]);
        }

        props.gaduka.on("message", handleMessages);

        return () => props.gaduka.off("message", handleMessages);
    });

    return (
        <div className="chat-history">
            {
                // TODO: With deleting messages functionality added, let the key be message id instead of array index
                history.map((message, index) => (
                    <Message
                        from={message.author}
                        date={message.date}
                        text={message.text}
                        key={index}
                        ip={props.showIps ? message.ip : undefined}
                        status={adminNicknames.indexOf(message.author.toLowerCase()) !== -1 ? "admin" : ""}
                    />
                ))
            }
        </div>
    )
}

export default MessagesHistory;