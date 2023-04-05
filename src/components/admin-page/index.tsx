import React, { useState, useEffect } from "react";
import Gaduka from "../../gaduka";
import AnonChat from "../chat/anon";
import AuthChat from "../chat/auth";
import BanUnbanUserBox from "./ban-unban-user";
import "./styles.scss";

interface IAdminPageProps {
    gaduka: Gaduka;
}

interface IAdminPageState {
    isLoggedIn: boolean;
    permissionStatus: "granted" | "denied" | "waiting";
}

const AdminPage: React.FunctionComponent<IAdminPageProps> = ({ gaduka }) => {
    const [{ isLoggedIn, permissionStatus }, setState] = useState<IAdminPageState>({ isLoggedIn: gaduka.isLoggedIn(), permissionStatus: "waiting" });

    useEffect(() => {
        const permissionChangeCallback = (isGranted: boolean) => setState({ isLoggedIn, permissionStatus: isGranted ? "granted" : "denied" });
        const onUserDataCallback = () => setState({ isLoggedIn: true, permissionStatus });
        const onUnauthorizedCallback = () => setState({ isLoggedIn: false, permissionStatus: "waiting" });

        gaduka.on("user_data", onUserDataCallback);
        gaduka.on("admin_access_status_change", permissionChangeCallback);
        gaduka.on("unauthorize", onUnauthorizedCallback);

        return () => {
            gaduka.off("user_data", onUserDataCallback);
            gaduka.off("admin_access_status_change", permissionChangeCallback);
            gaduka.off("unauthorize", onUnauthorizedCallback);
        }
    });

    if (!isLoggedIn) {
        return (
            <div className="info-content">
                <div className="title">В доступе отказано</div>
                <div className="todo">Войдите в аккаунт</div>
            </div>
        )
    }

    gaduka.setCurrentBranch("admin");

    if (permissionStatus === "denied") {
        return (
            <div className="info-content">
                <div className="title">В доступе отказано</div>
                <div className="todo">У вас недостаточно прав</div>
            </div>
        )
    }

    if (permissionStatus === "waiting") {
        return (
            <div className="info-content">
                <div className="title">Подождите</div>
                <div className="todo">Запрос обрабатывается</div>
            </div>
        )
    }

    return (
        <div className="admin-page-content">
            <h1>Админка</h1>
            <div className="chats">
                <AnonChat gaduka={gaduka} showAdminTools={true}></AnonChat>
                <AuthChat gaduka={gaduka} showAdminTools={true}></AuthChat>
            </div>
            <div className="admin-panel">
                <BanUnbanUserBox gaduka={gaduka} />
            </div>
        </div>
    )
}

export default AdminPage;