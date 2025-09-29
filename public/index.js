import { User, Guest } from "../source/components/index.js";

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
