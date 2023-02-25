import { Message, ResponseMessage } from "./messages/message";
import IErrorMessage from "./messages/response/error-message";

export default interface ITransmitterEvents {
    message: [Message];
    unhandled_error: [IErrorMessage];
    unhandled_message: [ResponseMessage];
    disconnect: [];
    error: [Error];
}