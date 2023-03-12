import IBaseResponseMessage from "../base-response-message";

export default interface INewParticipantMessage extends IBaseResponseMessage {
    type: "new participant";
    result: void;
}