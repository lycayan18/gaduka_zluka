import EventEmitter from "./utils/event-emitter";
import IBaseChatMessage from "./contracts/base-chat-message";
import Branch from "./contracts/branch";
import { Message } from "./contracts/messages/message";
import WithoutId from "./contracts/messages/without-id";
import IErrorMessage from "./contracts/messages/response/error-message";
import IGaduka from "./contracts/gaduka";
import IGetTokenMessage from "./contracts/messages/request/get-token-message";
import ICreateAccountMessage from "./contracts/messages/request/create-account-message";
import IUserData from "./contracts/user-data";
import IGetUserDataMessage from "./contracts/messages/request/get-user-data-message";
import BaseTransmitter from "./transmitters/base-transmitter";
import { IAnonSendChatMessageMessage, IAuthSendChatMessageMessage } from "./contracts/messages/request/send-chat-message-message";

interface IEvents {
    message: [IBaseChatMessage[]];
    ui_message: [string, "info" | "warning" | "error" | "critical error"];
    user_data: [IUserData];
}

export default class Gaduka extends EventEmitter<keyof IEvents, IEvents> implements IGaduka {
    private readonly _transmitter: BaseTransmitter;
    private _currentBranch: Branch | null = null;
    private _token: string | null = null;
    private _userData: IUserData | null = null;
    private _lastError: Error | null = null;

    constructor(transmitter: BaseTransmitter) {
        super();

        this._transmitter = transmitter;

        this._transmitter.on("message", this._parseServerMessage.bind(this));
        this._transmitter.on("unhandled_error", (message) => this.emit("ui_message", message.result.message, "error"));
        this._transmitter.on("unhandled_message", (message) => this.emit("ui_message", `От сервера пришло неожиданное сообщение типа ${message.type}`, "warning"));
        this._transmitter.on("disconnect", () => this.emit("ui_message", "Соединение с сервером разорвано.", "error"));
        this._transmitter.on("error", this._handleError.bind(this));

        // Get token and user data
        if (localStorage.getItem("token")) {
            this._token = localStorage.getItem("token");

            if (this._token === null) {
                return;
            }

            this._sendUserDataRequest();
        }
    }

    isLoggedIn() {
        return this._token !== "" && this._token !== null && this._userData !== null;
    }

    getUserData() {
        return this._userData;
    }

    setCurrentBranch(branch: Branch | null) {
        if (this._currentBranch === branch) {
            return;
        }

        this._currentBranch = branch;

        if (branch !== null) {
            this._transmitter.sendRequest({
                type: "subscribe",
                parameters: {
                    branch: branch
                }
            }, false);
        } else {
            this._transmitter.sendRequest({
                type: "unsubscribe all",
                parameters: {}
            }, false);
        }
    }

    send(branch: "/anon", nick: string, text: string): void;
    send(branch: "/auth", text: string): void;

    send(branch: Branch, nickOrText: string, text?: string) {
        if (this._currentBranch === null) {
            return;
        }

        switch (branch) {
            case "/anon": {
                if (!text) {
                    return;
                }

                this._transmitter.sendRequest({
                    type: "send",
                    parameters: {
                        nickname: nickOrText,
                        text,
                        branch: "/anon"
                    }
                }, false);

                break;
            }

            case "/auth": {
                if (!this.isLoggedIn() || this._token === null) {
                    return;
                }

                this._transmitter.sendRequest({
                    type: "send",
                    parameters: {
                        token: this._token,
                        text: nickOrText,
                        branch: "/auth"
                    }
                }, false);

                break;
            }
        }
    }

    /**
     * Can be helpful to get chat history beyond 100 last messages
     * @returns array of messages
     */
    getChatHistory(): IBaseChatMessage[] {
        // TODO: Chat history saving in local storage
        return [];
    }

    login(login: string, password: string): Promise<true | false> {
        return new Promise<boolean>((res, rej) => {
            const options: WithoutId<IGetTokenMessage> = {
                type: "get token",
                parameters: {
                    login,
                    password
                }
            };

            this._transmitter.sendRequest(options, true)
                .then(response => {
                    this._token = response.result.token;
                    localStorage.setItem("token", this._token);

                    this._sendUserDataRequest();

                    res(true);
                })
                .catch((x: IErrorMessage) => {
                    if (x.result.error_type === "invalid credentials") {
                        res(false);
                    } else {
                        rej(x);
                    }
                });
        });
    }

    createAccount(nickname: string, login: string, password: string): Promise<boolean> {
        return new Promise<boolean>((res, rej) => {
            const options: WithoutId<ICreateAccountMessage> = {
                type: "create account",
                parameters: {
                    nickname,
                    login,
                    password
                }
            }

            this._transmitter.sendRequest(options, true)
                .then(response => {
                    this._token = response.result.token;
                    res(true);
                })
                .catch(rej);
        })
    }

    private _sendUserDataRequest() {
        if (this._token === null) {
            return;
        }

        const options: WithoutId<IGetUserDataMessage> = {
            type: "get user data",
            parameters: {
                token: this._token
            }
        };

        this._transmitter.sendRequest(options, true)
            .then(message => {
                this._userData = message.result;

                this.emit("user_data", message.result);
            })
            .catch((message: IErrorMessage) => {
                if (message.result.error_type === "invalid token") {
                    localStorage.removeItem("token");
                }
            })
    }

    private _handleError(error: Error) {
        // If we get the same error everytime then we can just skip displaying them all
        if (this._lastError !== null && this._lastError.message === error.message) {
            return;
        }

        this._lastError = error;

        this.emit("ui_message", "Произошла ошибка подключения.", "error");
    }

    private _parseServerMessage(message: Message) {
        switch (message.type) {
            case "new message": {
                if (this._currentBranch === null) {
                    break;
                }

                // To prevent rendering DOM 100500 times in a frame we send array of messages with one
                // event instead of emitting new event for every message

                const messages: IBaseChatMessage[] = [];

                for (const chatMessage of message.result) {
                    messages.push({
                        author: chatMessage.nickname,
                        date: new Date(chatMessage.time),
                        text: chatMessage.text,
                        branch: this._currentBranch
                    });
                }

                this.emit("message", messages);

                break;
            }
        }
    }
}