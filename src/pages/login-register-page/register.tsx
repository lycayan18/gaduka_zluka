import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Gaduka from "../../gaduka";
import IErrorMessage from "../../contracts/messages/response/error-message";
import "./styles.scss";
import MessageDisplayer from "../../components/message-displayer";

interface IRegisterPageProps {
    gaduka: Gaduka;
}

const RegisterPage: React.FunctionComponent<IRegisterPageProps> = ({ gaduka }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        gaduka.setCurrentBranch(null);
    }, []);

    const formik = useFormik({
        initialValues: {
            login: '',
            password: '',
            nickname: ''
        },
        validationSchema: new Yup.ObjectSchema({
            login: Yup.string()
                .required('Это поле обязательно!')
                .min(4, 'Длина логина должна быть не менее 4')
                .max(40, 'Длина логина должна быть не более 40'),
            password: Yup.string()
                .required('Это поле обязательно!')
                .min(5, 'Длина пароля должна быть не менее 5')
                .max(80, 'Длина логина должна быть не более 80'),
            nickname: Yup.string()
                .required("Это поле обязательно!")
                .min(2, 'Длина никнейма должна быть не менее 2')
                .max(40, 'Длина ника должна быть не более 40')
        }),
        onSubmit: async ({ login, password, nickname }) => {
            try {
                setIsFetching(true);

                const status = await gaduka.createAccount(nickname, login, password);

                if (status) {
                    navigate("/");
                } else {
                    setErrorMessage("Не удалось создать аккаунт");
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    return;
                }

                const errorMessage = error as IErrorMessage;

                switch (errorMessage.result.error_type) {
                    case "nickname already used": {
                        setErrorMessage("Данный никнейм занят");
                        break;
                    }

                    case "login already used": {
                        setErrorMessage("Данный логин уже занят");
                        break;
                    }

                    default: {
                        gaduka.emit("ui_message", errorMessage.result.message, "error");
                        break;
                    }
                }
            } finally {
                setIsFetching(false);
            }
        }
    })

    return (
        <div className="login-register-page-wrapper">
            <Header gaduka={gaduka} transparent={true} />
            <form className="login-register-form" onSubmit={formik.handleSubmit}>
                <h1>Регистрация</h1>
                <p className="error-message">
                    {errorMessage !== null ? errorMessage : ""}
                </p>
                <table className="credentials-table">
                    <tbody>
                        <tr>
                            <td>
                                <p><label htmlFor="login">Никнейм:</label></p>
                                <input
                                    id="nickname"
                                    type="text"
                                    name="nickname"
                                    placeholder="Введите никнейм"
                                    value={formik.values.nickname}
                                    onChange={formik.handleChange}
                                    autoComplete="off"
                                    className={formik.touched.nickname && formik.errors.nickname ? 'invalid' : ''}
                                    disabled={isFetching}
                                />
                                {formik.touched.nickname && formik.errors.nickname && <p className='error-message small'>{formik.errors.nickname}</p>}
                            </td>
                        </tr>
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
                                <button className="btn-submit" type="submit" disabled={isFetching}>Зарегестрироваться</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <span className="small-text">Уже есть аккаунт? <Link to="/login">Войдите</Link></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <MessageDisplayer gaduka={gaduka} />
        </div>
    )
}

export default RegisterPage;