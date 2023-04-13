import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import "./styles.scss";
import IUserData from "../../contracts/user-data";
import ChatBox from "./chat-box";

interface IChatProps {
    gaduka: Gaduka;
    showAdminTools?: boolean;
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
            <ChatBox branch={"/auth"} gaduka={props.gaduka} showAdminTools={props.showAdminTools || false} />
        </div>
    )
}

export default AuthChat;