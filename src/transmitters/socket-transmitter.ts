import BaseTransmitter from "./base-transmitter";
import io, { Socket } from "socket.io-client";
import { RequestMessage, RequestType, ResponseMessage } from "../contracts/messages/message";
import WithoutId from "../contracts/messages/without-id";
import IErrorMessage from "../contracts/messages/response/error-message";
import ResponseMessageFromRequestMessage from "../contracts/messages/response-message-from-request-message";

interface IPendingRequest {
    id: number;
    res: (message: ResponseMessage) => void;
    rej: (error: IErrorMessage) => void;
}

export default class SocketTransmitter extends BaseTransmitter {
    private readonly _socket: Socket;
    private readonly _pendingRequests: Array<IPendingRequest> = [];
    private _currentId: number = 0;

    constructor(url?: string) {
        super();

        if (url) {
            this._socket = io(url);
        } else {
            this._socket = io();
        }

        this._socket.on("message", this.handleMessage.bind(this));
        this._socket.on("disconnect", () => this.emit("disconnect"));

        this._socket.io.on("error", error => {
            this.emit("error", error);

            console.error("SocketTransmitter:", error);
        });

        this._socket.io.on("reconnect", () => this.emit("reconnect"));
    }

    isReady() {
        return this._socket.connected;
    }

    sendRequest<S extends RequestType, T extends boolean = boolean, U extends RequestMessage<S> = RequestMessage<S>, ReturnType = T extends true ? Promise<ResponseMessageFromRequestMessage<S, U>> : void>(message: WithoutId<U> & { type: S }, waitForResponse: T): ReturnType {
        if (waitForResponse === true) {
            this._socket.send({
                ...message,
                id: this._currentId
            });

            this._currentId++;

            return new Promise<ResponseMessageFromRequestMessage<S, U>>((res, rej) => {
                this._pendingRequests.push({
                    res,
                    rej,
                    id: this._currentId - 1
                } as IPendingRequest);
            }) as ReturnType;
        }

        this._socket.send(message);
        return <ReturnType>undefined;
    }

    sendResponse(message: ResponseMessage): void {
        this._socket.send(message);
    }

    private handleMessage(message: ResponseMessage): void {
        if (!("id" in message)) {
            if (message.type === "error") {
                this.emit("unhandled_error", message);
            } else {
                this.emit("message", message);
            }
            return;
        }

        for (const pendingRequest of this._pendingRequests) {
            if (pendingRequest.id === message.id) {
                if (message.type === "error") {
                    pendingRequest.rej(message);
                } else {
                    pendingRequest.res(message);
                }

                // Remove this request from memory
                this._pendingRequests.splice(this._pendingRequests.indexOf(pendingRequest), 1);

                return;
            }
        }

        if (message.type === "error") {
            // By some reason pending request with such id was not found
            // Maybe, we've sent request with waitForResponse: false, but an error has occured
            this.emit("unhandled_error", message);
        } else {
            this.emit("unhandled_message", message);
        }
    }
}