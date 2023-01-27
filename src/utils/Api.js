class Api {
    constructor(options) {
        this._url = options.url;
        this._headers = options.headers;
    }

    // ПР 11 получение информации о пользователе
    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            method: "GET",
            headers: this._headers,
        }).then(this._errorChecking);
    }

    // Отправка данных о пользователе
    setUserInfo(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(data),
        }).then(this._errorChecking);
    }

    // Редактирование аватара
    setUserAvatar(link) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify(link),
        }).then(this._errorChecking);
    }

    // Загрузка карточек с сервера
    downloadingCards() {
        return fetch(`${this._url}/cards`, {
            method: 'GET',
            headers: this._headers,
        }).then(this._errorChecking);
    }

    // Удаление карточки пользователя
    deleteCard(id) {
        return fetch(`${this._url}/cards/${id}`, {
            method: "DELETE",
            headers: this._headers,
        }).then(this._errorChecking);
    }

    // Добавление карточки
    setCard(data) {
        return fetch(`${this._url}/cards`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link,
            }),
        }).then(this._errorChecking);
    }

    // Работа с лайком (постановка/удаление)
    changeLikeCardStatus(id, isLiked) {
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: isLiked ? "PUT" : "DELETE",
            headers: this._headers,
        }).then(this._errorChecking);
    }

    // Сообщение об ошибке
    _errorChecking(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Возникла ошибка моя: ${res.message}`);
    }
}

// Создаем один экземпляр класса на все приложение
const api = new Api({
    url: "https://mesto.nomoreparties.co/v1/cohort-45",
    headers: {
        authorization: "715ee43e-9fed-4d9c-98b6-32ed8625bba1",
        "Content-Type": "application/json",
    },
});

export default api;