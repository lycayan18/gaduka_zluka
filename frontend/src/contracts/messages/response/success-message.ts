import IBaseResponseMessageWithId from "../base-response-message-with-id";

export default interface ISuccessMessage extends IBaseResponseMessageWithId {
    type: "success";
    result: {};
}