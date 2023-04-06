import IBaseRequestMessage from "../base-request-message";

export default interface IBanUserMessage extends IBaseRequestMessage {
    type: "ban user";
    parameters: {
        ip: string;
    }
}