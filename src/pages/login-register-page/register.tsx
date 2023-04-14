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
            nickname: '',
            login: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema: new Yup.ObjectSchema({
            nickname: Yup.string()
                .required("Это поле обязательно!")
                .matches(/.*[0-9a-zA-Z]+.*/g, "Никнейм должен состоять только из латинских букв, цифр и пробелов между ними")
                .matches(/[0-9a-zA-Z]{2}/g, "Длина никнейма без пробелов слева и справа должна быть не менее 2")
                .max(40, 'Длина ника должна быть не более 40'),
            login: Yup.string()
                .required('Это поле обязательно!')
                .matches(/^\S*$/ig, "Логин не должен содержать пробелов")
                .min(4, 'Длина логина должна быть не менее 4')
                .max(40, 'Длина логина должна быть не более 40'),
            password: Yup.string()
                .required('Это поле обязательно!')
                .min(5, 'Длина пароля должна быть не менее 5')
                .max(80, 'Длина логина должна быть не более 80'),
            passwordConfirm: Yup.string()
                .required("Это поле обязательно!")
                .oneOf([Yup.ref('password')], 'Passwords must match')

        }),
        onSubmit: async ({ login, password, nickname }) => {
            try {
                setIsFetching(true);

                const status = await gaduka.createAccount(nickname.trim(), login, password);

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
                                <label>
                                    <input
                                        type="text"
                                        name="nickname"
                                        placeholder="Введите никнейм"
                                        value={formik.values.nickname}
                                        onChange={formik.handleChange}
                                        autoComplete="off"
                                        className={formik.touched.nickname && formik.errors.nickname ? 'invalid' : ''}
                                        disabled={isFetching}
                                    />
                                    <div className="label">Никнейм</div>
                                    {formik.touched.nickname && formik.errors.nickname && <span className='error-message'>{formik.errors.nickname}</span>}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
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
                                    {formik.touched.login && formik.errors.login && <span className='error-message'>{formik.errors.login}</span>}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
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
                                    {formik.touched.password && formik.errors.password && <span className='error-message'>{formik.errors.password}</span>}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
                                    <input
                                        type="password"
                                        name="passwordConfirm"
                                        placeholder="Повторите пароль"
                                        value={formik.values.passwordConfirm}
                                        onChange={formik.handleChange}
                                        autoComplete="off"
                                        className={formik.touched.passwordConfirm && formik.errors.passwordConfirm ? 'invalid' : ''}
                                        disabled={isFetching}
                                    />
                                    <div className="label">Повторите пароль</div>
                                    {formik.touched.passwordConfirm && formik.errors.passwordConfirm && <span className='error-message'>{formik.errors.passwordConfirm}</span>}
                                </label>
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