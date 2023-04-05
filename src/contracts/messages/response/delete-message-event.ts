import IBaseResponseMessage from "../base-response-message";
import Branch from "../../branch";

export default interface IDeleteMessageEvent extends IBaseResponseMessage {
    type: "delete message event";
    result: {
        id: number;
        branch: Branch;
    }
}