import IBaseMessage from "./base-message";

export default interface IBaseResponseMessage extends IBaseMessage {
    result: string | number | Array<unknown> | {};
}