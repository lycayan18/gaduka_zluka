import IBaseResponseMessageWithId from "../base-response-message-with-id";

export default interface IAuthorizeUserMessage extends IBaseResponseMessageWithId {
    type: "authorize user";
    result: true;
}