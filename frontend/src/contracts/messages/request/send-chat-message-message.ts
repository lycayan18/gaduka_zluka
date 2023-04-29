import Branch, { BranchesStartingWith } from "../../branch";
import IBaseRequestMessage from "../base-request-message";

interface IBaseSendChatMessageMessage extends IBaseRequestMessage {
    type: "send";
    parameters: {
        text: string;
        replyTo?: undefined | number;
        branch: Branch;
    };
}

interface IAnonSendChatMessageMessage extends IBaseSendChatMessageMessage {
    parameters: {
        nickname: string;
        text: string;
        replyTo?: undefined | number;
        branch: BranchesStartingWith<"/anon">;
    }
}

interface IAuthSendChatMessageMessage extends IBaseSendChatMessageMessage {
    parameters: {
        text: string;
        replyTo?: undefined | number;
        branch: BranchesStartingWith<"/auth">;
    }
}

export { IAnonSendChatMessageMessage, IAuthSendChatMessageMessage }