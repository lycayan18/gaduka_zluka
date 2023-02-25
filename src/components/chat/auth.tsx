import React, { useState, useEffect, useRef } from "react";
import Message from "./message";
import Gaduka from "../../gaduka";
import "./styles.scss";
import IBaseChatMessage from "../../contracts/base-chat-message";
import CreateMessageBox from "./create-message-box";
import IUserData from "../../contracts/user-data";

interface IChatProps {
    gaduka: Gaduka;
}

interface IChatState {
    history: IBaseChatMessage[];
    userData: IUserData | null;
}

const AuthChat: React.FunctionComponent<IChatProps> = (props: IChatProps) => {
    const [{ history, userData }, setState] = useState<IChatState>({
        history: props.gaduka.getChatHistory(),
        userData: props.gaduka.getUserData()
    });

    useEffect(() => {
        const handleMessages = (messages: IBaseChatMessage[]) => {
            // FIXME: remove this
            for (const message of messages) {
                console.log("onmessage:", message.text, "from", message.author, "at", message.date, "in", message.branch);
            }

            setState({
                // Save chat history in reverse order so new messages appear below old ones in the rendered DOM
                history: [...messages.reverse(), ...history],
                userData
            });
        }

        const handleLogIn = (data: IUserData) => {
            setState({
                history,
                userData: data
            })
        }

        props.gaduka.on("message", handleMessages);
        props.gaduka.on("user_data", handleLogIn);

        return () => {
            props.gaduka.off("message", handleMessages);
            props.gaduka.off("user_data", handleLogIn);
        }
    });

    return (
        <div className="chat-content">
            <p className="chat-name">{window.location.pathname}</p>
            <div className="chat-box">
                <div className="chat-history">
                    {
                        // TODO: With deleting messages functionality added, let the key be message id instead of array index
                        history.map((message, index) => (
                            <Message from={message.author} date={message.date} text={message.text} key={index} />
                        ))
                    }
                </div>
                <CreateMessageBox branch="/auth" gaduka={props.gaduka} disabled={!props.gaduka.isLoggedIn()} />
            </div>
        </div>
    )
}

export default AuthChat;