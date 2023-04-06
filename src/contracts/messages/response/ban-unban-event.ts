import IBaseResponseMessage from "../base-response-message";

export default interface IBanUnbanMessage extends IBaseResponseMessage {
    type: "ban event" | "unban event";
    result: {
        ip: string;
    }
}