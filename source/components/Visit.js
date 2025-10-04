import { handleCreateCardFromForm } from "../helpers/cardsPanel.js";
import { VisitCardiologist } from "./VisitCardiologist.js";
import { VisitDentist } from "./VisitDentist.js";
import { VisitTherapist } from "./VisitTherapist.js";

class Visit {
  constructor(visit) {
    this.visit = visit;
    this.listenersActive = false;
    this.listenerTimer = null;
    this.handleEscape = this.handleEscape.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  render(parent) {
    if (document.getElementById("create-visit")) {
      return;
    }

    parent.after(this.visit);

    this.setupDoctorFields();
    this.setupSubmitHandler();
    this.setupCloseHandler();
    this.addGlobalListeners();
    this.renderDoctorFields();
  }

  setupDoctorFields() {
    const doctorSelect = this.visit.querySelector("#doctor");

    if (!doctorSelect) {
      return;
    }

    doctorSelect.addEventListener("change", () => {
      this.renderDoctorFields();
    });
  }

  renderDoctorFields() {
    const doctorSelect = this.visit.querySelector("#doctor");
    const container = this.visit.querySelector("#adding-doctor-fields");

    if (!doctorSelect || !container) {
      return;
    }

    container.innerHTML = "";

    if (doctorSelect.value === "Кардіолог") {
      new VisitCardiologist(this.visit).render();
    } else if (doctorSelect.value === "Стоматолог") {
      new VisitDentist(this.visit).render();
    } else if (doctorSelect.value === "Терапевт") {
      new VisitTherapist(this.visit).render();
    }
  }

  setupSubmitHandler() {
    this.visit.addEventListener("submit", (event) => {
      event.preventDefault();
      handleCreateCardFromForm(this)
        .catch(() => {
          this.renderFallbackCard();
        })
        .finally(() => {
          this.destroyForm();
        });
    });
  }

  setupCloseHandler() {
    const closeButton = this.visit.querySelector(".close");

    if (!closeButton) {
      return;
    }

    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.destroyForm();
    });
  }

  addGlobalListeners() {
    if (this.listenerTimer !== null || this.listenersActive) {
      return;
    }

    this.listenerTimer = window.setTimeout(() => {
      document.addEventListener("keydown", this.handleEscape);
      document.addEventListener("click", this.handleOutsideClick);
      this.listenersActive = true;
      this.listenerTimer = null;
    }, 0);
  }

  removeGlobalListeners() {
    if (this.listenerTimer !== null) {
      window.clearTimeout(this.listenerTimer);
      this.listenerTimer = null;
    }

    if (!this.listenersActive) {
      return;
    }

    document.removeEventListener("keydown", this.handleEscape);
    document.removeEventListener("click", this.handleOutsideClick);
    this.listenersActive = false;
  }

  handleEscape(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.destroyForm();
    }
  }

  handleOutsideClick(event) {
    if (!this.visit || !this.visit.parentNode) {
      this.removeGlobalListeners();
      return;
    }

    if (!this.visit.contains(event.target)) {
      this.destroyForm();
    }
  }

  destroyForm() {
    this.removeGlobalListeners();

    if (this.visit && this.visit.parentNode) {
      this.visit.remove();
    }

    this.visit = null;
  }

  renderFallbackCard() {
    const root = document.getElementById("root");

    if (!root) {
      return;
    }

    const card = document.createElement("div");
    card.className = "visit-card";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "close";
    closeButton.textContent = "X";
    card.appendChild(closeButton);

    const info = [
      { label: "ПІБ пацієнта", value: this.visit?.fullName?.value },
      { label: "Лікар", value: this.visit?.doctor?.value },
      { label: "Мета візиту", value: this.visit?.visitPurpose?.value },
      { label: "Опис візиту", value: this.visit?.visitDescription?.value },
      { label: "Терміновість", value: this.visit?.priority?.value }
    ];

    info.forEach((item) => {
      const line = document.createElement("p");
      line.textContent = `${item.label}: ${item.value || "-"}`;
      card.appendChild(line);
    });

    closeButton.addEventListener("click", () => {
      card.remove();
    });

    root.appendChild(card);
  }
}

export default Visit;
