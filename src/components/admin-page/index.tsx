import React from "react";
import Gaduka from "../../gaduka";
import AnonChat from "../chat/anon";
import AuthChat from "../chat/auth";
import BanUnbanUserBox from "./ban-unban-user";
import "./styles.scss";

interface IAdminPageProps {
    gaduka: Gaduka;
}

const AdminPage: React.FunctionComponent<IAdminPageProps> = (props) => {
    props.gaduka.setCurrentBranch("admin");

    return (
        <div className="admin-page-content">
            <h1>Админка</h1>
            <div className="chats">
                <AnonChat gaduka={props.gaduka} showIps={true}></AnonChat>
                <AuthChat gaduka={props.gaduka} showIps={true}></AuthChat>
            </div>
            <div className="admin-panel">
                <BanUnbanUserBox gaduka={props.gaduka} />
            </div>
        </div>
    )
}

export default AdminPage;