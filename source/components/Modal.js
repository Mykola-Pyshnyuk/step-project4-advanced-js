import { loginRequest } from "../helpers/index.js";
import Guest from "./Guest.js";

class Modal {
  constructor(parameters) {}
  loginModal() {
    const registration = document.createElement(`form`);
    registration.id = `registration-form`;
    registration.innerHTML = `
  <input type="text" name="email" autocomplete="username" placeholder="Login" />
  <input type="password" name="password" autocomplete="current-password" placeholder="Password" />
  <button type="submit">Submit</button>
    `;
    registration.addEventListener(`submit`, (event) => {
      event.preventDefault();
      const loginUser = Object.fromEntries(new FormData(registration));

      loginRequest(loginUser)
        .then((userToken) => {})
        .catch((error) => console.error(error));
      registration.remove();
    });
    document.body.prepend(registration);
  }

  exitAccount(buttons, parent) {
    const confirmExit = document.createElement(`div`);

    const message = document.createElement(`h4`);
    message.classList.add(`logout-message`);
    message.textContent = `Ви впевнені що бажаєте вийти з акаунту`;

    const approveBtn = document.createElement("button");
    approveBtn.className = "logout-yes";
    approveBtn.type = "button";
    approveBtn.textContent = "Yes";

    const exitBtn = document.createElement("button");
    exitBtn.className = "logout-no";
    exitBtn.type = "button";
    exitBtn.textContent = "No";

    confirmExit.append(message, approveBtn, exitBtn);

    document.body.prepend(confirmExit);

    approveBtn.addEventListener(`click`, (event) => {
      localStorage.removeItem(`userToken`);
      buttons.remove();
      const guest = new Guest();
      guest.createGuestUI(parent);
      confirmExit.remove();
    });

    exitBtn.addEventListener(`click`, (event) => {
      confirmExit.remove();
    });
  }
}

export default Modal;
