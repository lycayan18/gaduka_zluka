import Branch from "./branch";

export default interface IBaseChatMessage {
    branch: Branch;
    author: string;
    date: Date;
    text: string;
}