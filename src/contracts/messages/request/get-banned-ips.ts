import IBaseRequestMessageWithId from "../base-request-message-with-id";

export default interface IGetBannedIpsMessage extends IBaseRequestMessageWithId {
    type: "get banned ips";
    parameters: {};
}