import React, { useState } from "react";
import Gaduka from "../../gaduka";
import Branch from "../../contracts/branch";
import CreateMessageBox from "./create-message-box";
import MessagesHistory from "./messages-history";
import IBaseChatMessage from "../../contracts/base-chat-message";

interface IChatBoxParams {
    gaduka: Gaduka;
    branch: Branch;
    showAdminTools: boolean;
    disabled?: boolean;
}

const ChatBox: React.FunctionComponent<IChatBoxParams> = ({ gaduka, branch, showAdminTools, disabled }) => {
    const [replyTo, setReplyTo] = useState<IBaseChatMessage | undefined>(undefined);

    const onReply = (messageId: number) => {
        const messages = gaduka.getChatHistory(branch);

        const message = messages.find(v => v.id === messageId);

        setReplyTo(message);

        if (!message) {
            throw new Error(`No such message with id ${messageId}`);
        }
    }

    return (
        <div className="chat-box">
            <MessagesHistory gaduka={gaduka} branch={branch} showAdminTools={showAdminTools || false} onReply={onReply} />
            <CreateMessageBox branch={branch} replyTo={replyTo} gaduka={gaduka} disabled={disabled || false} onSend={() => setReplyTo(undefined)} />
        </div>
    )
}

export default ChatBox;