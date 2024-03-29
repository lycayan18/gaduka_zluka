import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import IUserData from "../../contracts/user-data";
import Gaduka from "../../gaduka";
import "./styles.scss";

interface IHeaderProps {
    gaduka: Gaduka;
    transparent?: boolean;
}

const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
    const [userData, setUserData] = useState<IUserData | null>(props.gaduka.getUserData());

    const unauthorizeCallback = () => {
        props.gaduka.unauthorize();

        setUserData(null);
    }

    useEffect(() => {
        props.gaduka.on("user_data", setUserData);

        return () => props.gaduka.off("user_data", setUserData);
    });

    return (
        <div className={"header" + (props.transparent === true ? " transparent" : "")}>
            <Link to="/" className="non-underlined-link">
                <div className="logo">
                    <div className="logo-icon-container">
                        <img src="/assets/icons/logo.svg" className="logo-icon" alt="" />
                    </div>
                    <span className="logo-text">GadukaZluka.io <span className="cursor">|</span></span>
                </div>
            </Link>
            <div className="account">
                {
                    userData !== null ? userData.nickname : ""
                }
            </div>
            <div className="links">
                {
                    props.gaduka.isLoggedIn() ?
                        (
                            <a href="#" onClick={unauthorizeCallback}>Выход</a>
                        )
                        :
                        (
                            <>
                                <Link to="/login">Вползти</Link>
                                <Link to="/register">Загадючиться</Link>
                            </>
                        )
                }
            </div>
        </div>
    )
}

export default Header;