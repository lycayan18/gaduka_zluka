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

                const status = await gaduka.login(login, password);

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
                <h1>Вход</h1>
                <p className="error-message">
                    {displayErrorMessage ? "Неверные регистрационные данные" : ""}
                </p>
                <table className="credentials-table">
                    <tbody>
                        <tr>
                            <td>
                                <p><label htmlFor="login">Логин:</label></p>
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
                                {formik.touched.login && formik.errors.login && <p className='error-message small'>{formik.errors.login}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p><label htmlFor="password">Пароль:</label></p>
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
                                {formik.touched.password && formik.errors.password && <p className='error-message small'>{formik.errors.password}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="space"></div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="btn-submit" type="submit" disabled={isFetching}>Войти</button>
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
            <MessageDisplayer gaduka={gaduka} />
        </div>
    )
}

export default LoginPage;