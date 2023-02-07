import React, {useState} from "react";

const Login = ({onLogin}) => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    //
    // const handleChangeEmail = (event) =>{
    //     setEmail(event.target.value);
    // };
    //
    // const handleChangePassword = (event)=>{
    //     setPassword(event.target.value);
    // };
    //
    // const handleSubmit=(event)=>{
    //     event.preventDefault();
    //
    //     if(!email || !password){
    //         return
    //     }
    //     onLogin(email, password);
    // };
    const [userData, setUserData] = useState({email:'', password:''})

    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserData({...userData, [name]: value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!userData.email || !userData.password){
            return;
        }
       onLogin({email:userData.email, password:userData.password});
    }

    return (
        <>
            <div className="login">
                <form className="login__form" onSubmit={handleSubmit}>
                    <h2 className="login__title">Вход</h2>
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
                            autoComplete="on"
                            // value={email}
                            // onChange={handleChangeEmail}
                           value={userData.email}
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
                            maxLength="200"
                            autoComplete="on"
                            // value={password}
                            // onChange={handleChangePassword}
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button className="login__button-enter" type="submit"
                            aria-label="Вход в аккаунт пользователя">Вход
                    </button>
                </form>
            </div>
        </>
    );
}

export default Login;