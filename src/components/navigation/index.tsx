import React from "react";
import { Link } from "react-router-dom";
import "./styles.scss";

interface INavigationProps {
    currentURL: string;
}

const Navigation: React.FunctionComponent<INavigationProps> = (props) => (
    <div className="navigation-box">
        <Link to="/anon">
            <div className={"navigation" + (props.currentURL.startsWith("/anon") ? " active" : "")}>
                <span>
                    /anon
                </span>
            </div>
        </Link>
        <div className="navigation disabled">
            /anon/rand
        </div>
        <Link to="/auth">
            <div className={"navigation" + (props.currentURL.startsWith("/auth") ? " active" : "")}>
                <span>
                    /auth
                </span>
            </div>
        </Link>
        <div className="navigation disabled">
            /auth/rand
        </div>
    </div>
)

export default Navigation;