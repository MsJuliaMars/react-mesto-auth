import React, {useCallback, useEffect, useState} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import Footer from "components/Footer.jsx";
import ImagePopup from "components/ImagePopup.jsx";
import Main from "components/Main.jsx";
import PopupAddNewPlace from "components/PopupAddNewPlace.jsx";
import PopupDeleteCard from "components/PopupDeleteCard.jsx";
import PopupEditAvatar from "components/PopupEditAvatar.jsx";
import PopupEditProfile from "components/PopupEditProfile.jsx";
import Header from "./Header.jsx";
import Login from "./Login";
import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import ProtectedRouteElement from './ProtectedRoute';

import Register from "./Register";
import * as apiAuth from "../utils/apiAuth";
import InfoTooltip from "./InfoTooltip";
import {getContent} from "../utils/apiAuth";

function App() {

    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Авторизация
    const [loggedIn, setLoggedIn] = useState(false);
    const [successRegister, setSuccessRegister] = useState(false);
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({name: "", link: ""});

    const login = useCallback(() => {
        setLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        setLoggedIn(false);
    }, []);

    const handleRegister = ({email, password}) => {
        console.log({email, password});
        apiAuth.register(email, password).then((res) => {
            if (res?.data) {
                setSuccessRegister(true);
                setIsInfoTooltipPopupOpen(true);
                navigate('/sign-in')
            } else {
                setSuccessRegister(false);
                setIsInfoTooltipPopupOpen(true);
            }
        })
            .catch(err => {
                console.log(err);
                setSuccessRegister(false);
                setIsInfoTooltipPopupOpen(true);
            });
    }

    const handleLogin = ({email, password}) => {
        apiAuth.authorize(email, password).then((res) => {
            localStorage.setItem('jwt', res.jwt);
            // setLoggedIn(true);
            login();
            setEmail(email);
            setSuccessRegister(true);
            setIsInfoTooltipPopupOpen(true);
            navigate('/');
        }).catch((err) => {
            console.log(err);
            setSuccessRegister(false);
            setIsInfoTooltipPopupOpen(true);
        })
    };

    // сброс параметров после "выхода", удаление токена
    const handleLogout = () => {
        logout();
        setEmail(null);
        localStorage.removeItem('jwt');
        navigate("/sign-in");
    };

    //сохранение токена в локальном хранилище и передача email
    useEffect(() => {
        // если у пользователя есть токен в localStorage,
        // эта функция проверит валидность токена
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            // проверим токен
            apiAuth.checkToken(jwt).then((res) => {
                if (res) {
                    // авторизуем пользователя
                    // setLoggedIn(true);
                    login();
                    setEmail(res.data.email);
                    navigate("/");
                }
            }).catch((err) => console.log(err));
        }
    }, []);

    useEffect(() => {
        if (loggedIn) {
            navigate("/");
        }
    }, [loggedIn, navigate]);

    function handleAddKeydownListener() {
        document.addEventListener("keydown", handleEscClose);
    }

    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
        handleAddKeydownListener();
    };
    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
        handleAddKeydownListener();
    };
    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
        handleAddKeydownListener();
    };

    const handleEscClose = (evt) => {
        if (evt.key === "Escape") {
            closeAllPopups();
        }
    };

    const closeAllPopups = useCallback(() => {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsInfoTooltipPopupOpen(false);
        setSelectedCard({name: "", link: ""});
        document.removeEventListener("keydown", handleEscClose);
    }, []);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        handleAddKeydownListener();
    };

    const handleCardLike = (card) => {
        const isLiked = card.likes.some(i => i._id === currentUser._id); // снова проверяем, есть ли уже лайк на этой карточке
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            }).catch((err) => {
            console.log(err)
        });
    }

    const handleCardDelete = (card) => { //удаление карточки
        api.deleteCard(card._id)
            .then((res) => {
                setCards(cards => cards.filter((item) => item._id !== card._id));
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    }

    useEffect(() => { // получение данных о пользователе
        api.getUserInfo()
            .then((res) => setCurrentUser(res))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => { // получение карточек с сервера
        if (setLoggedIn) {
            api.downloadingCards()
                .then((res) => setCards(res))
                .catch((err) => console.log(err));
        }
    }, [loggedIn]);

    const handleUpdateAvatar = useCallback((avatarData) => {
        api.setUserAvatar(avatarData)
            .then((newData) => {
                setCurrentUser(newData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }, [closeAllPopups]);

    const handleUpdateUser = (userData) => {
        api.setUserInfo(userData).then((newData) => {
            setCurrentUser(newData);
            closeAllPopups();
        }).catch((err) => console.log(err));
    };

    const handleAddPlaceSubmit = ({name, link}) => {
        api.setCard({name, link})
            .then((res) => {
                setCards((cards) => [res, ...cards]);
                closeAllPopups();
            }).catch((err) => console.log(err));
    };

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="root">
                <Header email={email} onLogout={handleLogout}/>
                <Routes>
                    <Route
                        exact path="/"
                        element={
                            <ProtectedRouteElement loggedIn={loggedIn} element={Main}
                                                   onEditAvatar={handleEditAvatarClick}
                                                   onEditProfile={handleEditProfileClick}
                                                   onAddPlace={handleAddPlaceClick}
                                                   onCardClick={handleCardClick}
                                                   cards={cards}
                                                   onCardLike={handleCardLike}
                                                   onCardDelete={handleCardDelete}
                            > </ProtectedRouteElement>}/>
                    <Route path="/sign-up" element={<Register onRegister={handleRegister}/>}> </Route>
                    <Route path="/sign-in" element={<Login onLogin={handleLogin}/>}></Route>
                    <Route path="*" element={loggedIn ? <Navigate to="/"/> : <Navigate to="/sign-in"/>}> </Route>
                </Routes>
                <Footer/>
                <PopupEditAvatar
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />
                <PopupEditProfile
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />
                <PopupAddNewPlace
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                />
                <PopupDeleteCard
                    // isOpen={isDeleteCardPopupOpen}
                    onClose={closeAllPopups}
                />
                <ImagePopup onClose={closeAllPopups} card={selectedCard}/>
                <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups}
                             successRegister={successRegister}/>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;