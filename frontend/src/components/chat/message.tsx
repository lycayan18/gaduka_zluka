import React from "react";
import "./styles.scss";
import UserStatus from "../../contracts/user-status";
import Gaduka from "../../gaduka";
import Branch from "../../contracts/branch";
import IBaseChatMessage from "../../contracts/base-chat-message";
import MediaMessage from './media-message';

interface IMessageProps {
    from: string;
    text: string;
    date: Date;
    gaduka: Gaduka;
    branch: Branch;
    id: number;
    onReply?: ((messageId: number) => any) | undefined;
    showDeleteButton?: boolean;
    showReplyButton?: boolean;
    replyTo?: IBaseChatMessage | undefined | "deleted message";
    ip?: string | undefined;
    status?: UserStatus;
}

const Message: React.FunctionComponent<IMessageProps> = (props) => (
    (
        <div className={"message-box" + (props.status ? " " + props.status : "")}>
            {
                props.replyTo
                    ? props.replyTo === "deleted message"
                        ? <div className="replying-to-message">
                            <span className="deleted-message-text">
                                &#91;Deleted message&#93;
                            </span>
                        </div>
                        : <div className="replying-to-message">
                            <Message
                                from={props.replyTo.author}
                                text={props.replyTo.text}
                                date={props.replyTo.date}
                                gaduka={props.gaduka}
                                branch={props.branch}
                                id={props.id}
                                ip={props.ip}
                                status={props.replyTo.status || "user"}
                            />
                        </div>
                    : null
            }
            <div className="message-info">
                {
                    props.showDeleteButton ?
                        <button className="delete-button" onClick={() => props.gaduka.deleteMessage(props.id, props.branch)}>
                            <svg focusable="false" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                <path d="M9,3V4H4V6H5V19C5,20.1 5.9,21 7,21H17C18.1,21 19,20.1 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z">
    
                                </path>
                            </svg>
                        </button>
                        : null
                }
                <div className="author">
                    {props.from}
                </div>
                <div className="send-date">
                    {props.date.getHours().toString().padStart(2, '0')}
                    :
                    {props.date.getMinutes().toString().padStart(2, '0')}
                </div>
                {
                    props.showReplyButton === true ?
                        <button className="reply-button" onClick={() => props.onReply ? props.onReply(props.id) : null}>
                            <img src="/assets/icons/reply.svg" width="32" height="32" alt="" />
                        </button>
                        : null
                }
                <div className="ip">
                    {props.ip || null}
                </div>
            </div>
            <div className="text">
                <span>
                    <MediaMessage src={props.text} />
                </span>
            </div>
        </div>
    )
)

export default Message;