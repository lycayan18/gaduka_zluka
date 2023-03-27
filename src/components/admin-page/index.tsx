import React from "react";
import Gaduka from "../../gaduka";
import AnonChat from "../chat/anon";
import AuthChat from "../chat/auth";
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
                <AnonChat gaduka={props.gaduka} index={1} showIps={true}></AnonChat>
                <AuthChat gaduka={props.gaduka} index={1} showIps={true}></AuthChat>
            </div>
        </div>
    )
}

export default AdminPage;