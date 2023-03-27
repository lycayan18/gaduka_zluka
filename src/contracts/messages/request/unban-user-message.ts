import IBaseRequestMessage from "../base-request-message";

export default interface IUnbanUserMessage extends IBaseRequestMessage {
    type: "unban";
    parameters: {
        ip: string;
    }
}