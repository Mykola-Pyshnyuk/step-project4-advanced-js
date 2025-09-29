import Modal from "./Modal.js";

class Guest {
  constructor(parameters) {}

  createGuestUI(parent) {
    const loginBtn = document.createElement(`button`);
    loginBtn.className = "login";
    loginBtn.type = "button";
    loginBtn.textContent = "Login";
    parent.append(loginBtn);

    loginBtn.addEventListener;
    loginBtn.addEventListener(`click`, (event) => {
      const modal = new Modal();
      if (document.getElementById("registration-form")) {
        return;
      }
      modal.loginModal();
    });
  }
}

export default Guest;
