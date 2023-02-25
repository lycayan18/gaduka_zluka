import IBaseResponseMessage from "../base-response-message";

export default interface IErrorMessage extends IBaseResponseMessage {
    type: "error";
    result: {
        message: string;
        error_type: string;
    }
}