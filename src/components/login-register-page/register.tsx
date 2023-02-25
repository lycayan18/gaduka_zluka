import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header";
import Gaduka from "../../gaduka";
import IErrorMessage from "../../contracts/messages/response/error-message";
import "./styles.scss";

interface IRegisterPageProps {
    gaduka: Gaduka;
}

const RegisterPage: React.FunctionComponent<IRegisterPageProps> = (props: IRegisterPageProps) => {
    const [displayErrorMessage, setDisplayErrorMessage] = useState<boolean>(false);
    const navigate = useNavigate();

    props.gaduka.setCurrentBranch(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const gaduka = props.gaduka;

        const login = formData.get("login"), password = formData.get("password"), nickname = formData.get("nickname");

        if (typeof login !== "string" || typeof password !== "string" || typeof nickname !== "string") {
            if (typeof login !== "string") {
                gaduka.emit("ui_message", `К сожалению, в поле "login" пришёл тип "${typeof login}", а не "string"`, "error");
            }

            if (typeof password !== "string") {
                gaduka.emit("ui_message", `К сожалению, в поле "password" пришёл тип "${typeof password}", а не "string"`, "error");
            }

            if (typeof nickname !== "string") {
                gaduka.emit("ui_message", `К сожалению, в поле "nickname" пришёл тип "${typeof nickname}", а не "string"`, "error");
            }

            return;
        }

        gaduka.createAccount(nickname, login, password)
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
                <h1>Регистрация</h1>
                <p className="error-message">
                    {displayErrorMessage ? "Не удалось создать аккаунт" : ""}
                </p>
                <table className="credentials-table">
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="login">Никнейм</label>
                            </td>
                            <td>
                                <input id="nickname" type="text" name="nickname" required />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="login">Логин</label>
                            </td>
                            <td>
                                <input id="login" type="text" name="login" required />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="password">Пароль</label>
                            </td>
                            <td>
                                <input id="password" type="password" name="password" required />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="btn-submit" type="submit">СОЗДАТЬ</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <span className="small-text">или</span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <Link to="/login">войти</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default RegisterPage;