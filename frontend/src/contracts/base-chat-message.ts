import Branch from "./branch";
import UserStatus from "./user-status";

export default interface IBaseChatMessage {
    branch: Branch;
    author: string;
    date: Date;
    text: string;
    status: UserStatus;
    ip: string;
    id: number;
    replyTo?: number | undefined;
}