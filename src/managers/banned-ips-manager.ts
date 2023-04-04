import { Message } from "../contracts/messages/message";
import Gaduka from "../gaduka";
import BaseTransmitter from "../transmitters/base-transmitter";

export default class BannedIpsManager {
    private readonly _bannedIps: string[]
    private readonly _gaduka: Gaduka;
    private readonly _transmitter: BaseTransmitter;
    private _isSubscribed: boolean = false;

    constructor(gaduka: Gaduka, transmitter: BaseTransmitter) {
        this._bannedIps = [];
        this._gaduka = gaduka;
        this._transmitter = transmitter;

        this._gaduka.on("unhandled_message", this._handleMessage.bind(this));
    }

    isSubscribed() {
        return this._isSubscribed;
    }

    subscribeForUpdates() {
        if (this._isSubscribed) {
            return;
        }

        this._transmitter.sendRequest({
            type: "subscribe ban updates",
            parameters: {}
        }, false);

        this._isSubscribed = true;
    }

    unsubscribeFromUpdates() {
        if (!this._isSubscribed) {
            return;
        }

        this._transmitter.sendRequest({
            type: "unsubscribe ban updates",
            parameters: {}
        }, false);

        this._isSubscribed = false;
    }

    getBannedIps() {
        return this._bannedIps;
    }

    requestBannedIpsList() {
        this._transmitter.sendRequest({
            type: "get banned ips",
            parameters: {}
        }, true)
            .then(({ result }) => {
                // clear banned ips array length
                this._bannedIps.length = 0;

                this._bannedIps.push(...result.ips);

                this._fireChangedIpsListEvent();
            });
    }

    private _fireChangedIpsListEvent() {
        this._gaduka.emit("banned_ips_list_changed", this._bannedIps);
    }

    private _handleMessage(message: Message) {
        switch (message.type) {
            case "ban event": {
                const ip = message.result.ip;

                // Check that ip haven't pushed to list yet
                if (this._bannedIps.indexOf(message.result.ip) !== -1) {
                    return;
                }

                this._bannedIps.push(message.result.ip);

                this._fireChangedIpsListEvent();
                break;
            }

            case "unban event": {
                // Check that ip exists in list

                const index = this._bannedIps.indexOf(message.result.ip);

                if (index === -1) {
                    return;
                }

                this._bannedIps.splice(index, 1);

                this._fireChangedIpsListEvent();
                break;
            }
        }
    }
}