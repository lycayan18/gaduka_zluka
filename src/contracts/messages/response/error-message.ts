import IBaseResponseMessage from "../base-response-message";

type ErrorType =
    | "invalid credentials"
    | "invalid token"
    | "internal error"
    | "permission denied"
    | "banned";

export default interface IErrorMessage extends IBaseResponseMessage {
    type: "error";
    result: {
        message: string;
        error_type: ErrorType;
    }
}