import React from "react";
import "./styles.scss";
import UserStatus from "../../contracts/user-status";

interface IMessageProps {
    from: string;
    text: string;
    date: Date;
    ip?: string | undefined;
    status?: UserStatus;
}

const Message: React.FunctionComponent<IMessageProps> = (props) => (
    <div className={"message-box" + (props.status ? " " + props.status : "")}>
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

export default Message;