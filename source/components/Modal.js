import { loginRequest } from "../helpers/index.js";
import Guest from "./Guest.js";
import Visit from "./Visit.js";

class Modal {
  constructor(parameters) {}
  loginModal() {
    const registration = document.createElement(`form`);
    registration.id = `registration-form`;
    registration.innerHTML = `
  <input type="text" name="email" autocomplete="username" placeholder="Login" />
  <input type="password" name="password" autocomplete="current-password" placeholder="Password" />
  <button type="submit" class="submit">Submit</button>
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
    confirmExit.className = "confirm-exit-modal";
    

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

  createVisitForm(parent) {
    const visitForm = document.createElement("form");
    visitForm.id = `create-visit`;
    visitForm.innerHTML = `
            <input type="text" name="fullName" placeholder="Прізвище ім'я по батькові" required>
          <select name="doctor" id="doctor" required>
            <option value="" disabled selected> Оберіть доктора до якого хочете записатись на прийом </option>
            <option value="Кардіолог">Кардіолог</option>
            <option value="Стоматолог">Стоматолог</option>
            <option value="Терапевт">Терапевт</option>
          </select>

            <input type="text" name="visitPurpose" placeholder="Мета візиту" required>
            <input type="text" name="visitDescription" placeholder="Короткий опис візиту" required>

          <select name="priority" id="priority" required>
            <option value="" disabled selected>Оберіть ступінь терміновості</option>
            <option value="low">Низький</option>
            <option value="normal">Середній</option>
            <option value="high">Високий</option>
          </select>
          <input type="hidden" name="status" value="open">

          <div id="adding-doctor-fields"></div>
          
            <button type="submit" class="submit" >Створити</button>
            <button type="button" class="close">Закрити</button>
            `;
    const visit = new Visit(visitForm);
    visit.render(parent);
  }
}

export default Modal;
