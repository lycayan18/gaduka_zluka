import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import IBaseChatMessage from "../../contracts/base-chat-message";
import Message from "./message";
import "./styles.scss";
import Branch from "../../contracts/branch";

interface IMessagesHistoryProps {
    gaduka: Gaduka;
    branch: Branch;
    onReply?: (messageId: number) => any;
    showAdminTools?: boolean;
}

const MessagesHistory: React.FunctionComponent<IMessagesHistoryProps> = (props) => {
    const [history, setHistory] = useState<IBaseChatMessage[]>(props.gaduka.getChatHistory(props.branch).reverse());

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

        // Sometimes, somewhere in between getting chat history from props.gaduka.getChatHistory(props.branch)
        // and subscribing on "message" event that "message" event emits, and we miss chat history.
        // So, double check whether we have missed chat history or not
        setTimeout(() => {
            if (history.length === 0) {
                const chatHistory = props.gaduka.getChatHistory(props.branch);

                if (chatHistory.length !== 0) {
                    setHistory(chatHistory.reverse());
                }
            }
        });

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
                        replyTo={message.replyTo !== undefined ? history.find(v => v.id === message.replyTo) || "deleted message" : undefined}
                        key={message.id}
                        id={message.id}
                        gaduka={props.gaduka}
                        branch={props.branch}
                        ip={props.showAdminTools ? message.ip : undefined}
                        showDeleteButton={props.showAdminTools ? props.showAdminTools : false}
                        status={message.status}
                        showReplyButton={true}
                        onReply={props.onReply}
                    />
                ))
            }
        </div>
    )
}

export default MessagesHistory;