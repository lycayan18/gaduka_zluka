import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import IErrorMessage from "../../contracts/messages/response/error-message";
import Gaduka from "../../gaduka";
import Header from "../../components/header";
import MessageDisplayer from "../../components/message-displayer";
import "./styles.scss";

interface ILoginPageProps {
    gaduka: Gaduka;
}

const LoginPage: React.FunctionComponent<ILoginPageProps> = ({ gaduka }) => {
    const [displayErrorMessage, setDisplayErrorMessage] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        gaduka.setCurrentBranch(null);
    }, [])

    const formik = useFormik({
        initialValues: {
            login: '',
            password: '',
        },
        validationSchema: new Yup.ObjectSchema({
            login: Yup.string()
                .required('Это поле обязательно!')
                .matches(/^\S*$/ig, "Логин не должен содержать пробелов")
                .min(4, 'Длина логина должна быть не менее 4')
                .max(40, 'Длина логина должна быть не более 40'),
            password: Yup.string()
                .required('Это поле обязательно!')
                .min(5, 'Длина пароля должна быть не менее 5')
                .max(80, 'Длина логина должна быть не более 80')
        }),
        onSubmit: async ({ login, password }) => {
            try {
                setIsFetching(true);

                // Add triming here as I don't know, how to validate 
                const status = await gaduka.login(login.trim(), password.trim());

                status ? navigate("/") : setDisplayErrorMessage(true);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    return;
                }

                const errorMessage = error as IErrorMessage;

                gaduka.emit("ui_message", errorMessage.result.message, "error");
            } finally {
                setIsFetching(false);
            }
        }
    })

    return (
        <div className="login-register-page-wrapper">
            <Header gaduka={gaduka} transparent={true} />
            <form className="login-register-form" onSubmit={formik.handleSubmit} noValidate>
                <h1>Вползание</h1>
                <p className="error-message">
                    {displayErrorMessage ? "Неверные регистрационные данные" : ""}
                </p>
                <table className="credentials-table">
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="login">
                                    <input
                                        id="login"
                                        type="text"
                                        name="login"
                                        placeholder="Введите логин"
                                        value={formik.values.login}
                                        onChange={formik.handleChange}
                                        autoComplete="off"
                                        className={formik.touched.login && formik.errors.login ? 'invalid' : ''}
                                        disabled={isFetching}
                                    />
                                    <div className="label">Логин</div>
                                    {formik.touched.login && formik.errors.login && <span className='error-message small'>{formik.errors.login}</span>}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="password">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Введите пароль"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        autoComplete="off"
                                        className={formik.touched.password && formik.errors.password ? 'invalid' : ''}
                                        disabled={isFetching}
                                    />
                                    <div className="label">Пароль</div>
                                    {formik.touched.password && formik.errors.password && <span className='error-message small'>{formik.errors.password}</span>}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="btn-submit" type="submit" disabled={isFetching}>Вползти</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <span className="small-text">Ещё не в дурке? <Link to="/register">Загадючиться</Link></span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <span className="small-text">Уж анонимус? <Link to="/">Вползай!</Link></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <MessageDisplayer gaduka={gaduka} />
        </div>
    )
}

export default LoginPage;