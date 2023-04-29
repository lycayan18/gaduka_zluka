import React from "react";
import { Link } from "react-router-dom";
import "./styles.scss";

interface INavigationProps {
    currentURL: string;
}

function getClassname(link: string, branch: string) {
    if (link === branch) {
        return " active";
    }

    return link.startsWith(branch) ? " subbranch" : "";
}

const Navigation: React.FunctionComponent<INavigationProps> = (props) => (
    <div className="navigation-box">
        <Link to="/anon">
            <div className={"navigation" + getClassname(props.currentURL, "/anon")}>
                <span>
                    /anon
                </span>
            </div>
        </Link>
        <Link to="/anon/rand">
            <div className={"navigation" + getClassname(props.currentURL, "/anon/rand")}>
                <span>
                    /anon/rand
                </span>
            </div>
        </Link>
        <Link to="/auth">
            <div className={"navigation" + getClassname(props.currentURL, "/auth")}>
                <span>
                    /auth
                </span>
            </div>
        </Link>
        <Link to="/auth/rand">
            <div className={"navigation" + getClassname(props.currentURL, "/auth/rand")}>
                <span>
                    /auth/rand
                </span>
            </div>
        </Link>
    </div>
)

export default Navigation;