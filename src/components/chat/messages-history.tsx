import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import IBaseChatMessage from "../../contracts/base-chat-message";
import Message from "./message";
import "./styles.scss";
import Branch from "../../contracts/branch";

interface IMessagesHistoryProps {
    gaduka: Gaduka;
    branch: Branch;
    showAdminTools?: boolean;
}

const MessagesHistory: React.FunctionComponent<IMessagesHistoryProps> = (props) => {
    const [history, setHistory] = useState<IBaseChatMessage[]>(props.gaduka.getChatHistory());

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

        const handleMessageDelete = (id: number, branch: Branch) => {
            if (props.branch !== branch) {
                return;
            }

            setHistory(history.filter(message => message.id !== id));
        }

        props.gaduka.on("message", handleMessages);
        props.gaduka.on("message_delete", handleMessageDelete);

        return () => {
            props.gaduka.off("message", handleMessages)
            props.gaduka.off("message_delete", handleMessageDelete);
        };
    });

    return (
        <div className="chat-history">
            {
                history.map((message) => (
                    <Message
                        from={message.author}
                        date={message.date}
                        text={message.text}
                        key={message.id}
                        id={message.id}
                        gaduka={props.gaduka}
                        branch={props.branch}
                        ip={props.showAdminTools ? message.ip : undefined}
                        showDeleteButton={props.showAdminTools ? props.showAdminTools : false}
                        status={message.status}
                    />
                ))
            }
        </div>
    )
}

export default MessagesHistory;