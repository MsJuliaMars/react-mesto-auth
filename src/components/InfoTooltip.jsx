import React from 'react';
import success from '../images/success.png';
import fail from '../images/fail.png'

function InfoTooltip({isOpen, successRegister, onClose}) {

    return (
        <div className={`popup popup_type_auth ${isOpen && "popup_opened"}`} onClick={onClose}>
            <div className="popup__container">
                <button
                    className="popup__close popup__close-button"
                    type="button"
                    aria-label="Закрыть попап"
                    onClick={onClose}
                ></button>
                <form
                    className={`popup__form `}
                    name="popup-profile"
                    method="get"
                >
                    <img src={successRegister ? success : fail}
                         alt={successRegister ? "Вы успешно зарегистрировались!" : "Что-то пошло не так!\n" +
                             "Попробуйте ещё раз."} className="popup__image_tooltip"/>
                    <h2 className="popup__title_tooltip">{successRegister ? "Вы успешно зарегистрировались!" : "Что-то пошло не так!\n" +
                        "Попробуйте ещё раз."}</h2>
                </form>
            </div>
        </div>
    );
}

export default InfoTooltip;