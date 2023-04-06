import Branch from "../../branch";
import IBaseRequestMessage from "../base-request-message";

export default interface IDeleteMessage extends IBaseRequestMessage {
    type: "delete message";
    parameters: {
        id: number;
        branch: Branch;
    }
}