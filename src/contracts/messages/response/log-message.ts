import IBaseResponseMessage from "../base-request-message";

export default interface ILogMessage extends IBaseResponseMessage {
    type: "log message";
    result: {
        type: "info" | "debug" | "warning" | "error";
        message: string;
    }
}