import User from "../components/User.js";
class Request {
  constructor(url) {
    this.url = url;
  }

  getCardsUrl(cardId) {
    let cardsUrl = this.url;

    if (!cardsUrl.endsWith("/cards")) {
      cardsUrl = `${cardsUrl}/cards`;
    }

    if (cardId) {
      return `${cardsUrl}/${cardId}`;
    }

    return cardsUrl;
  }

  handleResponse(response) {
    if (!response.ok) {
      throw new Error("Сталася помилка під час запиту");
    }

    if (response.status === 204) {
      return true;
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }

  loginRequest(loginUser) {
    return fetch(`${this.url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Під час входу сталася помилка");
        }
        return response.text();
      })
      .then((userToken) => {
        localStorage.setItem("userToken", userToken);
        const user = new User();
        user.dashboard(document.querySelector(".page-header"));
        if (typeof document !== "undefined") {
          document.dispatchEvent(new Event("user-logged-in"));
        }
        return userToken;
      });
  }

  getCards() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return Promise.reject(new Error("Немає токена користувача"));
    }

    return fetch(this.getCardsUrl(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => this.handleResponse(response));
  }

  createCard(cardData) {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return Promise.reject(new Error("Немає токена користувача"));
    }

    return fetch(this.getCardsUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cardData),
    }).then((response) => this.handleResponse(response));
  }

  updateCard(cardId, cardData) {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return Promise.reject(new Error("Немає токена користувача"));
    }

    return fetch(this.getCardsUrl(cardId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cardData),
    }).then((response) => this.handleResponse(response));
  }

  deleteCard(cardId) {
    const token = localStorage.getItem("userToken");

    if (!token) {
      return Promise.reject(new Error("Немає токена користувача"));
    }

    return fetch(this.getCardsUrl(cardId), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => this.handleResponse(response));
  }
}

export default Request;
