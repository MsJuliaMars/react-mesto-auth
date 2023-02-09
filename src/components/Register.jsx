import React from "react";
import {useState} from 'react';
import {Link} from 'react-router-dom';

const Register = ({onRegister}) => {
    const [userData, setUserData] = useState({email: '', password: ''});

    const handleChange = (event) => {
        const {name, value} = event.target;

        setUserData({...userData, [name]: value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();// Запрещаем браузеру переходить по адресу формы

        if (userData.email === userData.password) {
            return;
        }
        onRegister({
            email: userData.email,
            password: userData.password
        });
    }

    return (
        <>
            <div className="login">
                <form className="login__form" onSubmit={handleSubmit}>
                    <h2 className="login__title">Регистрация</h2>
                    <label className="login__field">
                        <input
                            type="email"
                            name="email"
                            className="login__text login__text_email"
                            placeholder="Email"
                            // @ts-ignore
                            minLength="2"
                            // @ts-ignore
                            maxLength="40"
                            autoComplete="off"
                            value={userData.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="login__field">
                        <input
                            type="password"
                            name="password"
                            className="login__text login__text_password"
                            placeholder="Пароль"
                            // @ts-ignore
                            minLength="2"
                            // @ts-ignore
                            maxLength="20"
                            autoComplete="off"
                            value={userData.password || ''}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button className="login__button-enter" type="submit"
                            aria-label="Вход в аккаунт пользователя">Зарегистрироваться
                    </button>
                    <p>Уже зарегистрированы? <Link to='/sign-in'>Войти</Link></p>
                </form>
            </div>
        </>
    );
}

export default Register;