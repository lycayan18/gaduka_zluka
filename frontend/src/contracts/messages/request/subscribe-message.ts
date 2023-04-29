import IBaseRequestMessage from "../base-request-message";
import Branch from "../../branch";

export default interface ISubscribeMessage extends IBaseRequestMessage {
    type: "subscribe";
    parameters: {
        branch: Branch;
    }
}