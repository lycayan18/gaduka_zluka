import IBaseResponseMessage from "../base-response-message";

export default interface ILogMessage extends IBaseResponseMessage {
    type: "log message";
    result: {
        type: "info" | "debug" | "warning" | "error";
        message: string;
    }
}