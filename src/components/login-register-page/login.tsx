import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IErrorMessage from "../../contracts/messages/response/error-message";
import Gaduka from "../../gaduka";
import Header from "../header";
import MessageDisplayer from "../message-displayer";
import "./styles.scss";

interface ILoginPageProps {
    gaduka: Gaduka;
}

const LoginPage: React.FunctionComponent<ILoginPageProps> = (props: ILoginPageProps) => {
    const [displayErrorMessage, setDisplayErrorMessage] = useState<boolean>(false);
    const navigate = useNavigate();

    props.gaduka.setCurrentBranch(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const gaduka = props.gaduka;

        const login = formData.get("login"), password = formData.get("password");

        if (typeof login !== "string" || typeof password !== "string") {
            if (typeof login !== "string") {
                gaduka.emit("ui_message", `К сожалению, в поле "login" пришёл тип "${typeof login}", а не "string"`, "error");
            }

            if (typeof password !== "string") {
                gaduka.emit("ui_message", `К сожалению, в поле "password" пришёл тип "${typeof password}", а не "string"`, "error");
            }

            return;
        }

        gaduka.login(login, password)
            .then(status => {
                if (status) {
                    navigate("/");
                } else {
                    setDisplayErrorMessage(true);
                }
            })
            .catch((message: IErrorMessage) => {
                gaduka.emit("ui_message", message.result.message, "error");
            })
    }

    return (
        <div className="login-register-page-wrapper">
            <Header gaduka={props.gaduka} />
            <form className="login-register-form" onSubmit={handleSubmit}>
                <h1>Вход</h1>
                <p className="error-message">
                    {displayErrorMessage ? "Неверные регистрационные данные" : ""}
                </p>
                <table className="credentials-table">
                    <tbody>
                        <tr>
                            <td>
                                <p><label htmlFor="login">Логин:</label></p>
                                <input id="login" type="text" name="login" placeholder="Введите логин" required />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p><label htmlFor="password">Пароль:</label></p>
                                <input id="password" type="password" name="password" placeholder="Введите пароль" required />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="space"></div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="btn-submit" type="submit">Войти</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <span className="small-text">Ещё нет аккаунта? <Link to="/register">Зарегестрируйтесь</Link></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <MessageDisplayer gaduka={props.gaduka} />
        </div>
    )
}

export default LoginPage;