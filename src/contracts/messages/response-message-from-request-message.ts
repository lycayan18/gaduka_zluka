import { RequestMessage } from "./message";
import ICreateAccountMessage from "./request/create-account-message";
import IGetTokenMessage from "./request/get-token-message";
import IGetUserDataMessage from "./request/get-user-data-message";
import ISetTokenMessage from "./response/set-token-message";
import ISetUserDataMessage from "./response/set-user-data-message";

type ResponseMessageFromRequestMessage<T = RequestMessage> =
    T extends IGetTokenMessage | ICreateAccountMessage
    ? ISetTokenMessage
    : T extends IGetUserDataMessage
    ? ISetUserDataMessage
    : never;

export default ResponseMessageFromRequestMessage;