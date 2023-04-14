import IBaseResponseMessage from "../base-response-message";

type ErrorType =
    | "invalid credentials"
    | "invalid token"
    | "internal error"
    | "permission denied"
    | "nickname already used"
    | "login already used"
    | "not authorized"
    | "banned";

export default interface IErrorMessage extends IBaseResponseMessage {
    type: "error";
    result: {
        message: string;
        error_type: ErrorType;
    }
}