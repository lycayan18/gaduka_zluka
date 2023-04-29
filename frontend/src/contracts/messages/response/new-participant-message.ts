import IBaseResponseMessage from "../base-response-message";

export interface INewAnonParticipantMessage extends IBaseResponseMessage {
    type: "new participant";
    result: void;
}

export interface INewAuthParticipantMessage extends IBaseResponseMessage {
    type: "new participant";
    result: {
        nickname: string;
    };
}