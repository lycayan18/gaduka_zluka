import IBaseResponseMessage from "../base-response-message";

export default interface IUnbanedEventMessage extends IBaseResponseMessage {
    type: "unbanned";
    result: {}
}