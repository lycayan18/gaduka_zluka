import IBaseMessageWithId from "./base-message-with-id";
import IBaseResponseMessage from "./base-response-message";

export default interface IBaseResponseMessageWithId extends IBaseResponseMessage, IBaseMessageWithId {
    id: number;
}