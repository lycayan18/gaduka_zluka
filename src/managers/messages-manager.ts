import IBaseChatMessage from "../contracts/base-chat-message";
import Branch from "../contracts/branch";
import { Message } from "../contracts/messages/message";
import Gaduka from "../gaduka";
import BaseTransmitter from "../transmitters/base-transmitter";

/**
 * This manager stands for managing messages with ability to send and remove them.
 * It cathes following events:
 *      new message
 *      delete message event
 * 
 * Allows to reduce logic and lines of code in Gaduka class
 */
export default class MessagesManager {
    private readonly _gaduka: Gaduka;
    private readonly _transmitter: BaseTransmitter;
    private readonly _messagesHistory: Record<Branch, IBaseChatMessage[]>;
    private readonly _messagesCount: Record<Branch, number>;

    constructor(gaduka: Gaduka, transmitter: BaseTransmitter) {
        this._gaduka = gaduka;
        this._transmitter = transmitter;

        this._messagesHistory = {
            "/anon": [],
            "/auth": [],

            // Theese are unused
            "/anon/rand": [],
            "/auth/rand": []
        }

        this._messagesCount = {
            "/anon/rand": 0,
            "/auth/rand": 0,

            // Theese are unused
            "/anon": 0,
            "/auth": 0
        }

        this._gaduka.on("unhandled_message", this._handleMessage.bind(this));
        this._gaduka.on("lost_participant", () => {
            for (const branch of <Branch[]>["/anon/rand", "/auth/rand"]) {
                this._messagesCount[branch] = 0;
                this._messagesHistory[branch].length = 0;
            }
        })
    }

    getMessagesHistory(branch: Branch) {
        // TODO: Chat history saving in local storage
        // Construct a new array to avoid getting link to an array ( and unexpected updates of list )
        return [...this._messagesHistory[branch]];
    }

    sendMessage(branch: "/anon" | "/anon/rand", replyTo: number | null, nick: string, text: string | undefined): void;
    sendMessage(branch: "/auth" | "/auth/rand", replyTo: number | null, text: string): void;

    sendMessage(branch: Branch, replyTo: number | null, nickOrText: string, text?: string | undefined) {
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
                        branch,
                        replyTo: replyTo ?? undefined
                    }
                }, false);

                break;
            }

            case "/auth":
            case "/auth/rand": {
                if (!this._gaduka.isLoggedIn()) {
                    return;
                }

                this._transmitter.sendRequest({
                    type: "send",
                    parameters: {
                        text: nickOrText,
                        branch,
                        replyTo: replyTo ?? undefined
                    }
                }, false);

                break;
            }
        }
    }

    /**
     * In order to avoid doubled messages history we catch branch change and clear all
     * the chat histories
     */
    handleBranchChange() {
        // For some reason typescript can't get exact type from this array and interprets its
        // type as string[], in spite of array is const expression and its type can be evaluated
        // at compilation time
        for (const history of <Branch[]>["/anon", "/auth", "/anon/rand", "/auth/rand"]) {
            // Array can be erased in such way
            this._messagesHistory[history].length = 0;
        }
    }

    private _handleMessage(message: Message) {
        switch (message.type) {
            case "new message": {
                const currentBranch = this._gaduka.getCurrentBranch();

                if (currentBranch === null) {
                    break;
                }

                // To prevent rendering DOM 100500 times in a frame we send array of messages with one
                // event instead of emitting new event for every message

                const messages: IBaseChatMessage[] = [];

                for (const chatMessage of message.result) {
                    const branch = chatMessage.branch || (currentBranch !== "admin" ? currentBranch : null);

                    if (branch === null) {
                        continue;
                    }

                    const message = {
                        author: chatMessage.nickname || "",
                        date: new Date(chatMessage.time),
                        text: chatMessage.text,
                        branch: branch,
                        status: chatMessage.status || "user",
                        ip: chatMessage.ip,
                        id: chatMessage.id ?? this._messagesCount[branch],
                        replyTo: chatMessage.replyTo ?? undefined
                    };

                    this._messagesCount[branch]++;
                    messages.push(message);

                    this._messagesHistory[branch].push(message);
                }

                this._gaduka.emit("message", messages);

                break;
            }

            case "delete message event": {
                this._messagesHistory[message.result.branch] = this._messagesHistory[message.result.branch].filter(chatMessage => chatMessage.id !== message.result.id);

                this._gaduka.emit("message_delete", message.result.id, message.result.branch);

                break;
            }
        }
    }
}