import IBaseResponseMessage from "../base-response-message";

interface IMessage {
    nickname: string;
    text: string;
    time: number;
}

export default interface INewMessageEvent extends IBaseResponseMessage {
    type: "new message";
    result: IMessage[];
}