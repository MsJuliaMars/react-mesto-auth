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

function App() {

    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    // const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({name: "", link: ""});

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
        api.downloadingCards()
            .then((res) => setCards(res))
            .catch((err) => console.log(err));
    }, []);

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
                <Header/>
                <Main
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                />
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

            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;