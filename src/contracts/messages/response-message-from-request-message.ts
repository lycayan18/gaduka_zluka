import { RequestMessage } from "./message";
import IAuthorizeUserRequestMessage from "./request/authorize-user-message";
import ICreateAccountMessage from "./request/create-account-message";
import IGetTokenMessage from "./request/get-token-message";
import IGetUserDataMessage from "./request/get-user-data-message";
import IAuthorizeUserResponseMessage from "./response/authorize-user-message";
import ISetTokenMessage from "./response/set-token-message";
import ISetUserDataMessage from "./response/set-user-data-message";
import RequestType from "./request/request-type";

type ResponseMessageFromRequestMessage<S extends RequestType, T extends RequestMessage<S>> =
    T extends IGetTokenMessage | ICreateAccountMessage
    ? ISetTokenMessage
    : T extends IGetUserDataMessage
    ? ISetUserDataMessage
    : T extends IAuthorizeUserRequestMessage
    ? IAuthorizeUserResponseMessage
    : never;

export default ResponseMessageFromRequestMessage;