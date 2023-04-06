import IBaseRequestMessage from "../base-request-message";
import Branch from "../../branch";

export default interface ISubscribeAdminMessage extends IBaseRequestMessage {
    type: "subscribe admin";
    parameters: {
        branches: Array<Branch>;
    }
}