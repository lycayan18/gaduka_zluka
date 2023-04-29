// import { RequestMessage, ResponseMessage } from "../contracts/messages/message";
// import BaseTransmitter from "./base-transmitter";

// /**
//  * For testing purposes only
//  */
// export default class TestTransmitter extends BaseTransmitter {
//     constructor() {
//         super();

//         // FIXME: remove this
//         (window as any)["newMessage"] = this.emit.bind(this, "message");
//     }

//     sendRequest<T extends boolean>(message: RequestMessage, waitForResponse: T) {
//         if (message.type === "send") {
//             this.emit("message", {
//                 type: "new message",
//                 result: [{
//                     nickname: message.parameters.nickname,
//                     text: message.parameters.text,
//                     time: Date.now()
//                 }]
//             });
//         }

//         return <T extends true ? Promise<ResponseMessage> : void>new Promise(res => { });
//     }

//     sendResponse(message: ResponseMessage): void {

//     }
// }