import React from "react";
import Gaduka from "../../gaduka";
import "./styles.scss";
import ChatBox from "./chat-box";

interface IChatProps {
    gaduka: Gaduka;
    showAdminTools?: boolean;
}

const AnonChat: React.FunctionComponent<IChatProps> = (props: IChatProps) => (
    <div className="chat-content">
        <ChatBox branch={"/anon"} gaduka={props.gaduka} showAdminTools={props.showAdminTools || false} />
    </div>
)

export default AnonChat;