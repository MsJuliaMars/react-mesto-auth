import React from "react";
import Header from "./Header";

function Login() {
    return (
        <>
            <Header></Header>
            <div className="login">
                <form className="login__form">
                    <h2 className="login__title">Вход</h2>
                    <label className="login__field">
                        <input
                            type="email"
                            name="email"
                            className="login__text login__text_email"
                            id="login-email"
                            placeholder="Email"
                            // @ts-ignore
                            minLength="2"
                            // @ts-ignore
                            maxLength="40"
                            required
                        />
                    </label>
                    <label className="login__field">
                        <input
                            type="password"
                            name="password"
                            className="login__text login__text_password"
                            id="login-password"
                            //defaultValue="Исследователь океана"
                            placeholder="Пароль"
                            // @ts-ignore
                            minLength="2"
                            // @ts-ignore
                            maxLength="200"
                            required
                        />
                    </label>
                    <button className="login__button-enter" type="submit"
                            aria-label="Вход в аккаунт пользователя">Вход</button>
                </form>
            </div>
        </>
    );
}

export default Login;