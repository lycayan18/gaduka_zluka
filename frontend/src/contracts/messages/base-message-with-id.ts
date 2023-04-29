import IBaseMessage from "./base-message"

export default interface IBaseMessageWithId extends IBaseMessage {
    id: number;
}