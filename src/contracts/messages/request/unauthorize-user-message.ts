import IBaseRequestMessage from "../base-request-message";

export default interface IUnauthorizeUserMessage extends IBaseRequestMessage {
    type: "unauthorize user";
    parameters: void;
}