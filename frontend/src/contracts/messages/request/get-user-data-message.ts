import IBaseRequestMessageWithId from "../base-request-message-with-id";

export default interface IGetUserDataMessage extends IBaseRequestMessageWithId {
    type: "get user data";
    parameters: {
        token: string;
    }
}