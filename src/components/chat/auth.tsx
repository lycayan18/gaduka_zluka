import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import "./styles.scss";
import CreateMessageBox from "./create-message-box";
import IUserData from "../../contracts/user-data";
import MessagesHistory from "./messages-history";

interface IChatProps {
    gaduka: Gaduka;
}

interface IChatState {
    userData: IUserData | null;
}

const AuthChat: React.FunctionComponent<IChatProps> = (props: IChatProps) => {
    const [{ userData }, setState] = useState<IChatState>({
        userData: props.gaduka.getUserData()
    });

    useEffect(() => {
        const handleLogIn = (data: IUserData) => {
            setState({
                userData: data
            })
        }

        props.gaduka.on("user_data", handleLogIn);

        return () => props.gaduka.off("user_data", handleLogIn);
    });

    return (
        <div className="chat-content">
            <p className="chat-name">{window.location.pathname}</p>
            <div className="chat-box">
                <MessagesHistory gaduka={props.gaduka} />
                <CreateMessageBox branch="/auth" gaduka={props.gaduka} disabled={!props.gaduka.isLoggedIn()} />
            </div>
        </div>
    )
}

export default AuthChat;