import React, { useRef, useState } from "react";
import Gaduka from "../../../gaduka";
import "../styles.scss";

function isValidIp(ip: string) {
    const bytes = ip.split(".");

    if (ip === "0.0.0.0" || ip === "127.0.0.1") {
        return false;
    }

    if (bytes.length !== 4) {
        return false;
    }

    for (const byte of bytes) {
        if (byte === "") {
            return false;
        }

        const number = Number(byte);

        if (number < 0 || number > 255 || Number.isNaN(number)) {
            return false;
        }
    }

    return true;
}

interface IBanUnbanUserBoxProps {
    gaduka: Gaduka;
}

interface IBanUnbanUserBoxState {
    searchingIP: string;
    bannedIps: string[];
}

const BanUnbanUserBox: React.FunctionComponent<IBanUnbanUserBoxProps> = ({ gaduka }) => {
    const [{ searchingIP, bannedIps }, setState] = useState<IBanUnbanUserBoxState>({ searchingIP: "", bannedIps: [] });

    const handleIPInputBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isValidIp(searchingIP)) {
            gaduka.getBannedIps()
                .then(ips => setState({ searchingIP: e.target.value, bannedIps: ips }));
        } else {
            setState({ searchingIP: e.target.value, bannedIps })
        }
    }

    const handleBanUnbanButtonClicked = () => {
        if (!isValidIp(searchingIP)) {
            return;
        }

        if (bannedIps.includes(searchingIP)) {
            // unban user
            gaduka.sendUnbanRequest(searchingIP)
        } else {
            // ban user
            gaduka.sendBanRequest(searchingIP)
        }

        gaduka.getBannedIps()
            .then(ips => setState({ searchingIP, bannedIps: ips }));
    }

    return (
        <div className="function-box">
            <div className="box-title">Блокировка/разблокировка пользователей</div>
            <div className="search-box">
                <input type="search" placeholder="IP адрес пользователя" onInput={handleIPInputBox} />
                <button onClick={handleBanUnbanButtonClicked} disabled={!isValidIp(searchingIP)}>
                    {
                        isValidIp(searchingIP)
                            ?
                            (bannedIps.includes(searchingIP)
                                ? "Разблокировать"
                                : "Заблокировать")
                            : "..."
                    }
                </button>
            </div>
        </div>
    )
}

export default BanUnbanUserBox;