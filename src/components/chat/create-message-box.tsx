import React, { FormEvent, useState } from "react";
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
}

export default function CreateMessageBox(props: ICreateMessageBoxProps) {
    const [state, setState] = useState<ICreateMessageBoxState>({
        nickname: "Anonymous",
        messageText: ""
    });

    const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (props.disabled === true) {
            return;
        }

        if (state.nickname === "" || state.messageText === "") {
            return;
        }

        setState({
            nickname: state.nickname,
            messageText: ''
        });

        switch (props.branch) {
            case "/anon": {
                props.gaduka.send("/anon", state.nickname, state.messageText);
                break;
            }

            case "/auth": {
                props.gaduka.send("/auth", state.messageText);
                break;
            }
        }
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