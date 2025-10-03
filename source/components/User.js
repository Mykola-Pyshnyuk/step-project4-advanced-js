import Modal from "./Modal.js";
class User {
  constructor(parameters) {}

  dashboard(parent) {
    if (document.querySelector(".login")) {
      document.querySelector(".login").remove();
    }

    const buttons = document.createElement("div");

    const createBtn = document.createElement("button");
    createBtn.className = "create-visit";
    createBtn.type = "button";
    createBtn.textContent = "Create visit";

    const exitBtn = document.createElement("button");
    exitBtn.className = "logout-account";
    exitBtn.type = "button";
    exitBtn.textContent = "Logout";

    buttons.append(createBtn, exitBtn);
    parent.append(buttons);

    exitBtn.addEventListener(`click`, (event) => {
      const modal = new Modal();
      modal.exitAccount(buttons, parent);
    });

    createBtn.addEventListener(`click`, (event) => {
      const modal = new Modal();
      modal.createVisitForm(parent);
    });
  }
}

export default User;
