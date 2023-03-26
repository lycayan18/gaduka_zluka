import IBaseMessage from "./base-message";

export default interface IBaseRequestMessage extends IBaseMessage {
    parameters: number | string | Array<unknown> | {} | void;
}