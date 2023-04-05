import Branch from "../../branch";
import IBaseResponseMessage from "../base-response-message";
import UserStatus from "../../user-status";

interface IMessage {
    nickname: string;
    text: string;
    time: number;
    status?: UserStatus;
    branch?: Branch;
    ip: string;
}

export default interface INewMessageEvent extends IBaseResponseMessage {
    type: "new message";
    result: IMessage[];
}