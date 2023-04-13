import Branch from "../../branch";
import IBaseResponseMessage from "../base-response-message";
import UserStatus from "../../user-status";

interface IMessage {
    nickname: string;
    text: string;
    time: number;
    id: number;
    ip: string;
    status?: UserStatus;
    branch?: Branch;
    replyTo?: number;
}

export default interface INewMessageEvent extends IBaseResponseMessage {
    type: "new message";
    result: IMessage[];
}