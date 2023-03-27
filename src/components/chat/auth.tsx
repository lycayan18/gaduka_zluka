import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import "./styles.scss";
import CreateMessageBox from "./create-message-box";
import IUserData from "../../contracts/user-data";
import MessagesHistory from "./messages-history";

interface IChatProps {
    gaduka: Gaduka;
    index?: number;
    showIps?: boolean;
}

interface IChatState {
    userData: IUserData | null;
}

const AuthChat: React.FunctionComponent<IChatProps> = (props: IChatProps) => {
    const [{ userData }, setState] = useState<IChatState>({
        userData: props.gaduka.getUserData()
    });

    useEffect(() => {
        const handleLogIn = (data?: IUserData) => {
            setState({
                userData: data || null
            })
        }

        props.gaduka.on("user_data", handleLogIn);
        props.gaduka.on("unauthorize", handleLogIn);

        return () => {
            props.gaduka.off("user_data", handleLogIn);
            props.gaduka.off("unauthorize", handleLogIn);
        };
    });

    return (
        <div className="chat-content">
            <p className="chat-name">/auth</p>
            <div className="chat-box">
                <MessagesHistory gaduka={props.gaduka} branch="/auth" showIps={props.showIps || false} />
                <CreateMessageBox branch="/auth" gaduka={props.gaduka} disabled={!props.gaduka.isLoggedIn()} />
            </div>
        </div>
    )
}

export default AuthChat;