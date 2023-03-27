import Branch from "../../branch";
import IBaseResponseMessage from "../base-response-message";

interface IMessage {
    nickname: string;
    text: string;
    time: number;
    branch?: Branch;
    ip: string;
}

export default interface INewMessageEvent extends IBaseResponseMessage {
    type: "new message";
    result: IMessage[];
}