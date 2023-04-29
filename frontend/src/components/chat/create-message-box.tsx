import React, { FormEvent, useState, useEffect, useRef } from "react";
import Gaduka from "../../gaduka";
import Branch from "../../contracts/branch";
import "./styles.scss";
import IBaseChatMessage from "../../contracts/base-chat-message";
import Message from "./message";

interface ICreateMessageBoxProps {
    branch: Branch;
    gaduka: Gaduka;
    disabled?: boolean;
    replyTo?: IBaseChatMessage | undefined;
    onSend?: () => any;
    onReplyCancel?: () => any;
}

interface ICreateMessageBoxState {
    nickname: string;
    messageText: string;
    disabled: boolean;
    isBanned: boolean;
}

export default function CreateMessageBox(props: ICreateMessageBoxProps) {
    const [state, setState] = useState<ICreateMessageBoxState>({
        nickname: localStorage.getItem("anonBranchNickname") || "Anonymous",
        messageText: "",
        disabled: props.disabled || props.gaduka.isBanned(),
        isBanned: props.gaduka.isBanned()
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem("anonBranchNickname", e.target.value);

        setState({
            ...state,
            nickname: e.target.value
        });
    }

    const handleMessageTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            messageText: e.target.value
        });
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (props.disabled || state.isBanned) {
            return;
        }

        if (state.nickname === "" || state.messageText === "") {
            return;
        }

        if (state.messageText.trim() === "" || state.nickname.trim() === "") {
            return;
        }

        const replyTo = props.replyTo ? props.replyTo.id : null;

        switch (props.branch) {
            case "/anon":
            case "/anon/rand": {
                props.gaduka.send(props.branch, replyTo, state.nickname, state.messageText);

                if (props.onSend) {
                    props.onSend();
                }
                break;
            }

            case "/auth":
            case "/auth/rand": {
                props.gaduka.send(props.branch, replyTo, state.messageText);

                if (props.onSend) {
                    props.onSend();
                }
                break;
            }
        }

        setState({
            ...state,
            messageText: '',
        });
    }

    useEffect(() => {
        const handleBannedCallback = () => setState({ ...state, disabled: true, isBanned: true });
        const handleUnbannedCallback = () => setState({ ...state, disabled: props.disabled || false, isBanned: false });

        props.gaduka.on("banned", handleBannedCallback);
        props.gaduka.on("unbanned", handleUnbannedCallback);

        if(props.replyTo) {
            if(inputRef.current !== null) {
                inputRef.current.focus();
            }
        }

        return () => {
            props.gaduka.off("banned", handleBannedCallback);
            props.gaduka.off("unbanned", handleUnbannedCallback);
        }
    });

    if (state.isBanned) {
        return (
            <form className="create-message-box">
                <span className="error-message">Вы не имеете прав писать сообщения</span>
            </form>
        )
    }

    return (
        <form className="create-message-box" onSubmit={handleSubmit}>
            {
                props.branch.startsWith("/anon")
                    ? (
                        <div className="nickname-box">
                            <span>Ваш ник:</span>
                            <input type="text" placeholder="ъ" value={state.nickname} onInput={handleNicknameInput} maxLength={40} />
                        </div>
                    )
                    : null
            }
            {
                props.replyTo
                    ? <div className="reply-to-message">
                        <img src="/assets/icons/reply.svg" width="32" height="32" alt="" />
                        <Message
                            from={props.replyTo.author}
                            text={props.replyTo.text}
                            status={props.replyTo.status}
                            date={props.replyTo.date}
                            gaduka={props.gaduka}
                            branch={props.branch}
                            id={props.replyTo.id}
                        />
                        <button className="cancel-button" type="reset" onClick={() => props.onReplyCancel ? props.onReplyCancel() : null}>
                            &#x2715;
                        </button>
                    </div>
                    : null
            }
            <div className="type-box">
                <input type="text" className="message-input" placeholder="Трататата..."
                    onInput={handleMessageTextInput} value={state.messageText} maxLength={1000}
                    disabled={props.disabled === true}
                    ref={inputRef}
                />
                <button type="submit"
                    disabled={state.nickname.trim() === "" || state.messageText.trim() === "" || props.disabled === true}>
                    <div className="send-icon-container">
                        <img src="/assets/icons/send.svg" className="send-icon" alt=">" />
                    </div>
                </button>
            </div>
        </form>
    )
}