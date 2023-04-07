import React, { FormEvent, useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import Branch from "../../contracts/branch";
import "./styles.scss";

interface ICreateMessageBoxProps {
    branch: Branch;
    gaduka: Gaduka;
    disabled?: boolean;
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

        switch (props.branch) {
            case "/anon":
            case "/anon/rand": {
                props.gaduka.send(props.branch, state.nickname, state.messageText);
                break;
            }

            case "/auth":
            case "/auth/rand": {
                props.gaduka.send(props.branch, state.messageText);
                break;
            }
        }

        setState({
            nickname: state.nickname,
            messageText: '',
            disabled: state.disabled,
            isBanned: state.isBanned
        });
    }

    useEffect(() => {
        const handleBannedCallback = () => setState({ ...state, disabled: true, isBanned: true });
        const handleUnbannedCallback = () => setState({ ...state, disabled: props.disabled || false, isBanned: false });

        props.gaduka.on("banned", handleBannedCallback);
        props.gaduka.on("unbanned", handleUnbannedCallback);

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
            <div className="type-box">
                <input type="text" className="message-input" placeholder="Трататата..."
                    onInput={handleMessageTextInput} value={state.messageText} maxLength={1000}
                    disabled={props.disabled === true}
                />
                <button type="submit"
                    disabled={state.nickname === "" || state.messageText === "" || props.disabled === true}>
                    <div className="send-icon-container">
                        <img src="/assets/icons/send.svg" className="send-icon" alt=">" />
                    </div>
                </button>
            </div>
        </form>
    )
}