import IBaseRequestMessage from "../base-request-message";

export default interface IUnsibscribeAllMessage extends IBaseRequestMessage {
    type: "unsubscribe all";
    parameters: {};
}