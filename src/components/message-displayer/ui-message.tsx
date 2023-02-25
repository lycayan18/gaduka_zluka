import React from "react";
import MessageType from "../../contracts/components/message-displayer/message-type";
import "./styles.scss";

interface IUIMessageProps {
    type: MessageType;
    message: string;
    onClose: () => void;
}

const UIMessage: React.FunctionComponent<IUIMessageProps> = (props) => {
    return (
        <div className={`message-container ${props.type}`}>
            <div className="icon"></div>
            <div className="text">{props.message}</div>
            <div className="close-button" onClick={props.onClose}>&#x2715;</div>
        </div>
    )
}

export default UIMessage;