import { RequestMessage } from "./message";
import IAuthorizeUserRequestMessage from "./request/authorize-user-message";
import ICreateAccountMessage from "./request/create-account-message";
import IGetTokenMessage from "./request/get-token-message";
import IGetUserDataMessage from "./request/get-user-data-message";
import IAuthorizeUserResponseMessage from "./response/authorize-user-message";
import ISetTokenMessage from "./response/set-token-message";
import ISetUserDataMessage from "./response/set-user-data-message";
import RequestType from "./request/request-type";
import IGetBannedIpsMessage from "./request/get-banned-ips";
import ISetBannedIpsMessage from "./response/set-banned-ips";
import ISubscribeAdminMessage from "./request/subcribe-admin-message";
import ISuccessMessage from "./response/success-message";

type ResponseMessageFromRequestMessage<S extends RequestType, T extends RequestMessage<S>> =
    T extends IGetTokenMessage | ICreateAccountMessage
    ? ISetTokenMessage
    : T extends IGetUserDataMessage
    ? ISetUserDataMessage
    : T extends IAuthorizeUserRequestMessage
    ? IAuthorizeUserResponseMessage
    : T extends IGetBannedIpsMessage
    ? ISetBannedIpsMessage
    : T extends ISubscribeAdminMessage
    ? ISuccessMessage
    : never;

export default ResponseMessageFromRequestMessage;