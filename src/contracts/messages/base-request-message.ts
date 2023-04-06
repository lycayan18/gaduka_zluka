import IBaseMessage from "./base-message";
import { RequestType } from "./message";

export default interface IBaseRequestMessage extends IBaseMessage {
    type: RequestType;
    parameters: number | string | Array<unknown> | {} | void;
}