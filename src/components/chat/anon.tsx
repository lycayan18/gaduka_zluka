import React from "react";
import Gaduka from "../../gaduka";
import "./styles.scss";
import CreateMessageBox from "./create-message-box";
import MessagesHistory from "./messages-history";

interface IChatProps {
    gaduka: Gaduka;
    showAdminTools?: boolean;
}

const AnonChat: React.FunctionComponent<IChatProps> = (props: IChatProps) => (
    <div className="chat-content">
        <p className="chat-name">/anon</p>
        <div className="chat-box">
            <MessagesHistory gaduka={props.gaduka} branch="/anon" showAdminTools={props.showAdminTools || false} />
            <CreateMessageBox branch="/anon" gaduka={props.gaduka} />
        </div>
    </div>
)

export default AnonChat;