import EventEmitter from "./utils/event-emitter";
import IBaseChatMessage from "./contracts/base-chat-message";
import Branch from "./contracts/branch";
import { Message, ResponseMessage } from "./contracts/messages/message";
import WithoutId from "./contracts/messages/without-id";
import IErrorMessage from "./contracts/messages/response/error-message";
import IGaduka from "./contracts/gaduka";
import IGetTokenMessage from "./contracts/messages/request/get-token-message";
import ICreateAccountMessage from "./contracts/messages/request/create-account-message";
import IUserData from "./contracts/user-data";
import IGetUserDataMessage from "./contracts/messages/request/get-user-data-message";
import BaseTransmitter from "./transmitters/base-transmitter";
import BannedIpsManager from "./managers/banned-ips-manager";

interface IEvents {
    message: [IBaseChatMessage[]];
    ui_message: [string, "info" | "warning" | "error" | "critical error"];
    user_data: [IUserData];
    unauthorize: [];
    banned: [];
    banned_ips_list_changed: [string[]];
    unhandled_message: [Message];
    unbanned: [];
    new_participant: [string?];
    lost_participant: [];
}

export default class Gaduka extends EventEmitter<keyof IEvents, IEvents> implements IGaduka {
    private readonly _transmitter: BaseTransmitter;
    private _currentBranch: Branch | null | "admin" = null;
    private _token: string | null = null;
    private _userData: IUserData | null = null;
    private _lastError: Error | null = null;
    private _userAuthorized: boolean = false;
    private _isBanned: boolean = false;
    private _adminNicknames: string[] = [];
    private _bannedIpsManager: BannedIpsManager;

    constructor(transmitter: BaseTransmitter) {
        super();

        this._transmitter = transmitter;

        this._transmitter.on("message", this._parseServerMessage.bind(this));
        this._transmitter.on("unhandled_error", this._handleUnhandledError.bind(this));
        this._transmitter.on("unhandled_message", this._handleUnhandledMessage.bind(this));
        this._transmitter.on("disconnect", () => this.emit("ui_message", "Соединение с сервером разорвано.", "error"));
        this._transmitter.on("error", this._handleError.bind(this));

        // Initialize managers
        this._bannedIpsManager = new BannedIpsManager(this, this._transmitter);

        // Get token, authorize user and get user data
        if (localStorage.getItem("token")) {
            this._token = localStorage.getItem("token");

            if (this._token === null) {
                return;
            }

            this._sendUserDataRequest();
            this._authorizeUser();
        }
    }

    setAdminNicknames(nicknames: string[]) {
        this._adminNicknames = nicknames;
    }

    getAdminNicknames() {
        return this._adminNicknames;
    }

    isBanned() {
        return this._isBanned;
    }

    isLoggedIn() {
        return this._token !== "" && this._token !== null && this._userData !== null;
    }

    getUserData() {
        return this._userData;
    }

    getBannedIps() {
        return this._bannedIpsManager.getBannedIps();
    }

    setCurrentBranch(branch: Branch | "admin" | null) {
        if (this._currentBranch === branch) {
            return;
        }

        this._currentBranch = branch;

        if (branch === "admin") {
            this._transmitter.sendRequest({
                type: "subscribe admin",
                parameters: {
                    branches: ["/anon", "/auth"]
                }
            }, false);

            this._bannedIpsManager.subscribeForUpdates();

            return;
        }

        if (this._bannedIpsManager.isSubscribed()) {
            this._bannedIpsManager.unsubscribeFromUpdates();
        }

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

    send(branch: "/anon" | "/anon/rand", nick: string, text: string): void;
    send(branch: "/auth" | "/auth/rand", text: string): void;

    send(branch: Branch, nickOrText: string, text?: string) {
        if (this._currentBranch === null) {
            return;
        }

        switch (branch) {
            case "/anon":
            case "/anon/rand": {
                if (!text) {
                    return;
                }

                this._transmitter.sendRequest({
                    type: "send",
                    parameters: {
                        nickname: nickOrText,
                        text,
                        branch
                    }
                }, false);

                break;
            }

            case "/auth":
            case "/auth/rand": {
                if (!this.isLoggedIn() || this._token === null) {
                    return;
                }

                this._transmitter.sendRequest({
                    type: "send",
                    parameters: {
                        text: nickOrText,
                        branch
                    }
                }, false);

                break;
            }
        }
    }

    sendBanRequest(ip: string) {
        this._transmitter.sendRequest({
            type: "ban user",
            parameters: {
                ip,
                password: localStorage.getItem(atob("bG9jYWxlUGFzc3dvcmQ=")) || ""
            }
        }, false);
    }

    sendUnbanRequest(ip: string) {
        this._transmitter.sendRequest({
            type: "unban",
            parameters: {
                ip,
                password: localStorage.getItem(atob("bG9jYWxlUGFzc3dvcmQ=")) || ""
            }
        }, false);
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
                    this._setToken(response.result.token);

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

    unauthorize(): void {
        this.emit("unauthorize");
        this.emit("lost_participant");

        this._removeToken();

        this._transmitter.sendRequest({
            type: "unauthorize user",
            parameters: {}
        }, false);
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
                    this._setToken(response.result.token);
                    res(true);
                })
                .catch(rej);
        })
    }

    private _setBannedStatus(isBanned: boolean) {
        if (this._isBanned === isBanned) {
            return;
        }

        this._isBanned = isBanned;
        this.emit(isBanned ? "banned" : "unbanned");
    }

    private _handleUnhandledMessage(message: ResponseMessage) {
        console.log("Unexpected message from server:", message);
        this.emit("ui_message", `От сервера пришло неожиданное сообщение типа ${message.type}`, "warning");
    }

    private _handleUnhandledError(message: IErrorMessage) {
        if (message.result.error_type === "banned") {
            this._setBannedStatus(true);
            return;
        }

        this.emit("ui_message", message.result.message, "error");
    }

    private _setToken(token: string) {
        this._token = token;

        localStorage.setItem("token", this._token);
    }

    private _removeToken() {
        this._token = null;

        localStorage.removeItem("token");
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
                    this._removeToken();
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

    private _authorizeUser() {
        if (this._token === null) {
            return;
        }

        this._transmitter.sendRequest({
            type: "authorize user",
            parameters: {
                token: this._token
            }
        }, true)
            .then(out => {
                this._userAuthorized = out.result === true;
            })
            .catch(err => {
                if (err.type === "invalid token") {
                    this._removeToken();
                }
            });
    }

    private _parseServerMessage(message: Message) {
        switch (message.type) {
            case "unbanned": {
                this._setBannedStatus(false);
                break;
            }

            case "log message": {
                if (localStorage.getItem("showServerMessages") !== "true") {
                    break;
                }

                switch (message.result.type) {
                    case "debug": {
                        console.debug("--- Server Message:", message.result.message);
                        break;
                    }

                    case "info": {
                        console.info("--- Server Message:", message.result.message);
                        break;
                    }

                    case "error": {
                        console.error("--- Server Message:", message.result.message);
                        break;
                    }

                    case "warning": {
                        console.warn("--- Server Message:", message.result.message);
                        break;
                    }
                }

                break;
            }

            case "new participant": {
                if (this._currentBranch !== "/anon/rand" && this._currentBranch !== "/auth/rand") {
                    break;
                }

                if (typeof message.result === "object" && "nickname" in message.result) {
                    this.emit("new_participant", message.result.nickname);
                } else {
                    this.emit("new_participant");
                }

                break;
            }

            case "new message": {
                if (this._currentBranch === null) {
                    break;
                }

                // To prevent rendering DOM 100500 times in a frame we send array of messages with one
                // event instead of emitting new event for every message

                const messages: IBaseChatMessage[] = [];

                for (const chatMessage of message.result) {
                    const branch = chatMessage.branch || (this._currentBranch !== "admin" ? this._currentBranch : null);

                    if (branch === null) {
                        continue;
                    }

                    messages.push({
                        author: chatMessage.nickname || "",
                        date: new Date(chatMessage.time),
                        text: chatMessage.text,
                        branch: branch,
                        ip: chatMessage.ip
                    });
                }

                this.emit("message", messages);

                break;
            }

            case "lost participant": {
                this.emit("lost_participant");
                break;
            }

            default: {
                this.emit("unhandled_message", message);
                break;
            }
        }
    }
}