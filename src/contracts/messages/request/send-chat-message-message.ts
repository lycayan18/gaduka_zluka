import Branch, { BranchesStartingWith } from "../../branch";
import IBaseRequestMessage from "../base-request-message";

interface IBaseSendChatMessageMessage extends IBaseRequestMessage {
    type: "send";
    parameters: {
        text: string;
        branch: Branch;
    };
}

interface IAnonSendChatMessageMessage extends IBaseSendChatMessageMessage {
    parameters: {
        nickname: string;
        text: string;
        branch: BranchesStartingWith<"/anon">;
    }
}

interface IAuthSendChatMessageMessage extends IBaseSendChatMessageMessage {
    parameters: {
        token: string;
        text: string;
        branch: BranchesStartingWith<"/auth">;
    }
}

export { IAnonSendChatMessageMessage, IAuthSendChatMessageMessage }