import IBaseRequestMessageWithId from "../base-request-message-with-id";

export default interface IGetTokenMessage extends IBaseRequestMessageWithId {
    type: "get token";
    parameters: {
        login: string;
        password: string;
    }
}