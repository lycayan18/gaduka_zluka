import IBaseResponseMessageWithId from "../base-response-message-with-id";

export default interface ISetBannedIpsMessage extends IBaseResponseMessageWithId {
    type: "set banned ips";
    result: {
        ips: string[];
    }
}