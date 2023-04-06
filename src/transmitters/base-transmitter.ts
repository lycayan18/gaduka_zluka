import EventEmitter from "../utils/event-emitter";
import ITransmitterEvents from "../contracts/transmitter-events";
import { RequestMessage, RequestType, ResponseMessage } from "../contracts/messages/message";
import ResponseMessageFromRequestMessage from "../contracts/messages/response-message-from-request-message";
import WithoutId from "../contracts/messages/without-id";

/**
 * BaseTransmitter class holds for sending messages between server and client.
 */
export default abstract class BaseTransmitter extends EventEmitter<keyof ITransmitterEvents, ITransmitterEvents> {
    abstract sendRequest<S extends RequestType, U extends RequestMessage<S> = RequestMessage<S>, T extends true | false = boolean>(message: WithoutId<U> & { type: S }, waitForResponse: T):
        T extends true
        ? Promise<ResponseMessageFromRequestMessage<S, U>>
        : void;

    abstract sendResponse(message: WithoutId<ResponseMessage>): void;

    abstract isReady(): boolean;
}