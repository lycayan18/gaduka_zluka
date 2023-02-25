import { IAnonSendChatMessageMessage, IAuthSendChatMessageMessage } from "./request/send-chat-message-message";
import ISubscribeMessage from "./request/subscribe-message";
import IUnsibscribeAllMessage from "./request/unsubscribe-all-message";
import INewMessageEvent from "./response/new-message-event-message";
import ISetTokenMessage from "./response/set-token-message";
import IGetTokenMessage from "./request/get-token-message";
import ICreateAccountMessage from "./request/create-account-message";
import IGetUserDataMessage from "./request/get-user-data-message";
import ISetUserDataMessage from "./response/set-user-data-message";
import IErrorMessage from "./response/error-message";

type RequestType = "send" | "subscribe" | "unsubscribe all" | "get token" | "create account" | "get user data";

type RequestMessage<T extends RequestType = RequestType> =
    (
        | IAnonSendChatMessageMessage
        | IAuthSendChatMessageMessage
        | ISubscribeMessage
        | IUnsibscribeAllMessage
        | IGetTokenMessage
        | ICreateAccountMessage
        | IGetUserDataMessage
    ) & { type: T }; // Use this method instead of just union of conditional types for proper typings

type ResponseMessage =
    | INewMessageEvent
    | ISetTokenMessage
    | ISetUserDataMessage
    | IErrorMessage;

type Message = RequestMessage | ResponseMessage;

export { RequestMessage, ResponseMessage, Message, RequestType }