import { IAnonSendChatMessageMessage, IAuthSendChatMessageMessage } from "./request/send-chat-message-message";
import ISubscribeMessage from "./request/subscribe-message";
import IUnsibscribeAllMessage from "./request/unsubscribe-all-message";
import IGetTokenMessage from "./request/get-token-message";
import ICreateAccountMessage from "./request/create-account-message";
import IAuthorizeUserRequestMessage from "./request/authorize-user-message";
import IGetUserDataMessage from "./request/get-user-data-message";
import IUnauthorizeUserRequestMessage from "./request/unauthorize-user-message";
import IBanUserMessage from "./request/ban-user-message";
import IUnbanUserMessage from "./request/unban-user-message";
import ISubscribeAdminMessage from "./request/subcribe-admin-message";
import INewMessageEvent from "./response/new-message-event-message";
import ISetTokenMessage from "./response/set-token-message";
import ISetUserDataMessage from "./response/set-user-data-message";
import ILogMessage from "./response/log-message";
import IAuthorizeUserResponseMessage from "./response/authorize-user-message";
import { INewAnonParticipantMessage, INewAuthParticipantMessage } from "./response/new-participant-message";
import ILostParticipantMessage from "./response/lost-participant-message";
import IUnbanedEventMessage from "./response/unbanned-event-message";
import IErrorMessage from "./response/error-message";
import RequestType from "./request/request-type";

type RequestMessage<T extends RequestType = RequestType> =
    (
        | IAnonSendChatMessageMessage
        | IAuthSendChatMessageMessage
        | ISubscribeMessage
        | IUnsibscribeAllMessage
        | IGetTokenMessage
        | ICreateAccountMessage
        | IGetUserDataMessage
        | IAuthorizeUserRequestMessage
        | IUnauthorizeUserRequestMessage
        | IBanUserMessage
        | ISubscribeAdminMessage
        | IUnbanUserMessage
    ) & { type: T }; // Use this method instead of just union of conditional types for proper typings

type ResponseMessage =
    | INewMessageEvent
    | ISetTokenMessage
    | ISetUserDataMessage
    | IAuthorizeUserResponseMessage
    | INewAnonParticipantMessage
    | INewAuthParticipantMessage
    | ILostParticipantMessage
    | IUnbanedEventMessage
    | ILogMessage
    | IErrorMessage;

type Message = RequestMessage | ResponseMessage;

export { RequestMessage, ResponseMessage, Message, RequestType }