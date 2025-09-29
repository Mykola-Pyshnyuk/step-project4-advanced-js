import User from "../components/User.js";
class Request {
  constructor(url) {
    this.url = url;
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
          throw new Error("Підчас реєстрації виникла помилка");
        }
        return response.text();
      })
      .then((userToken) => {
        localStorage.setItem("userToken", userToken);
        const user = new User();
        user.dashboard(document.querySelector(".page-header"));
        return userToken;
      })
      .catch((error) => console.error(error));
  }
}

export default Request;
