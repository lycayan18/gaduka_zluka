import IBaseRequestMessage from "../base-request-message";

export default interface ISubscribeUnsubscribeBanUpdatesMessage extends IBaseRequestMessage {
    type: "subscribe ban updates" | "unsubscribe ban updates";
    parameters: {};
}