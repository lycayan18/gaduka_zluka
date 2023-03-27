import React from "react";
import Gaduka from "../../gaduka";
import "./styles.scss";

interface IMessageProps {
    from: string;
    text: string;
    date: Date;
    gaduka: Gaduka;
    ip?: string | undefined;
    status?: string;
}

export default function Message(props: IMessageProps) {
    const handleBanButtonClicked = () => {
        if (!props.ip) {
            return;
        }

        props.gaduka.sendBanRequest(props.ip);
    }

    const adminNicknames = props.gaduka.getAdminNicknames();
    const isAdmin = adminNicknames.indexOf(props.from) !== -1;

    const displayButton = props.ip && !isAdmin;

    const banButton = (
        <button className="ban-button" onClick={handleBanButtonClicked} title="Забанить пользователя">
            &#128711;
        </button>
    )

    return (
        <div className={"message-box" + (props.status ? " " + props.status : "")}>
            {
                displayButton ? banButton : null
            }
            <div className="author">
                <div className="ip">
                    {props.ip || null}
                </div>
                {props.from}
            </div>
            <div className="send-date">
                {props.date.getHours().toString().padStart(2, '0')}
                :
                {props.date.getMinutes().toString().padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="text">
                <span>
                    {props.text}
                </span>
            </div>
        </div>
    )
}