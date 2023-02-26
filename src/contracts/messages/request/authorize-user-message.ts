import IBaseRequestMessageWithId from "../base-request-message-with-id";

export default interface IAuthorizeUserMessage extends IBaseRequestMessageWithId {
    type: "authorize user";
    parameters: {
        token: string;
    }
}