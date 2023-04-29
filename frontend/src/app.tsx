import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/header";
import Navigation from "./components/navigation";
import Gaduka from "./gaduka";
import MessageDisplayer from "./components/message-displayer";
import "./styles.scss";

interface IAppProps {
    gaduka: Gaduka;
}

const App: React.FunctionComponent<IAppProps> = (props: IAppProps) => {
    const location = useLocation();

    switch (location.pathname) {
        case "/anon":
        case "/anon/rand":
        case "/auth":
        case "/auth/rand":
            props.gaduka.setCurrentBranch(location.pathname);
            break;

        default:
            props.gaduka.setCurrentBranch(null);
    }

    return (
        <>
            <MessageDisplayer gaduka={props.gaduka} />
            <Header gaduka={props.gaduka} />
            <div className="content">
                <Navigation currentURL={window.location.pathname} />
                <div className="wrapper">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default App;