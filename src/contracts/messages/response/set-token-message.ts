import IBaseResponseMessageWithId from "../base-response-message-with-id";

export default interface ISetTokenMessage extends IBaseResponseMessageWithId {
    type: "set token";
    result: {
        token: string;
    }
}