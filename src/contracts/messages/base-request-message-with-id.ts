import IBaseMessageWithId from "./base-message-with-id";
import IBaseRequestMessage from "./base-request-message";

export default interface IBaseRequestMessageWithId extends IBaseRequestMessage, IBaseMessageWithId {
    id: number;
}