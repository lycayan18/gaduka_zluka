import IBaseRequestMessageWithId from "../base-request-message-with-id";

export default interface ICreateAccountMessage extends IBaseRequestMessageWithId {
    type: "create account";
    parameters: {
        login: string;
        password: string;
        nickname: string;
    }
}