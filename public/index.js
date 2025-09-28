// const root = document.querySelector("#root");
class Request {
  constructor(parameters) {}

  static loginRequest(loginUser) {
    fetch("https://ajax.test-danit.com/api/v2/cards/login", {
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
        response.text();
      })
      .then((userToken) => {
        localStorage.setItem("userToken", userToken);
        const user = new User();
        user.dashboard(document.querySelector(".page-header"));
      })
      .catch((error) => console.error(error));
  }
}

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
      try {
        Request.loginRequest(loginUser);
      } catch (error) {
        console.error(error);
      }
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
      new Modal().exitAccount(buttons, parent);
    });
  }
}

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

document.addEventListener(`DOMContentLoaded`, (event) => {
  const authSection = document.querySelector(".page-header");
  const loginUser = localStorage.getItem("userToken");
  if (loginUser) {
    console.log("Ви зареєстровані");
    const user = new User();
    user.dashboard(authSection);
  } else {
    console.log("Ви не зареєстровані");
    const guest = new Guest();
    guest.createGuestUI(authSection);
  }
});
