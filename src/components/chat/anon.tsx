import React from "react";
import Gaduka from "../../gaduka";
import "./styles.scss";
import CreateMessageBox from "./create-message-box";
import MessagesHistory from "./messages-history";

interface IChatProps {
    gaduka: Gaduka;
}

const AnonChat: React.FunctionComponent<IChatProps> = (props: IChatProps) => (
    <div className="chat-content">
        <p className="chat-name">{window.location.pathname}</p>
        <div className="chat-box">
            <MessagesHistory gaduka={props.gaduka} />
            <CreateMessageBox branch="/anon" gaduka={props.gaduka} />
        </div>
    </div>
)

export default AnonChat;