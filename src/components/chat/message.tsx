import React from "react";
import "./styles.scss";

interface IMessageProps {
    from: string;
    text: string;
    date: Date;
    status?: string;
}

export default function Message(props: IMessageProps) {
    return (
        <div className={"message-box" + (props.status ? " " + props.status : "")}>
            <div className="author">{props.from}</div>
            <div className="send-date">
                {props.date.getHours().toString().padStart(2, '0')}
                :
                {props.date.getMinutes().toString().padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="text"><span>{props.text}</span></div>
        </div>
    )
}