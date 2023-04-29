import IUserData from "../../user-data";
import IBaseResponseMessageWithId from "../base-response-message-with-id";

export default interface ISetUserDataMessage extends IBaseResponseMessageWithId {
    type: "set user data";
    result: IUserData;
}