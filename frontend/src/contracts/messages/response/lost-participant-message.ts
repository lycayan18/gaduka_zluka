import IBaseResponseMessage from "../base-response-message";

export default interface ILostParticipantMessage extends IBaseResponseMessage {
    type: "lost participant";
    result: void;
}