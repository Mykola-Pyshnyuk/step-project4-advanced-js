class Visit {
  constructor(visit) {
    this.visit = visit;
  }

  handleDoctorChange() {
    const doctor = this.visit.querySelector(`#doctor`);
    doctor.addEventListener(`change`, async (event) => {
      event.preventDefault();
      const insertAfterNode = this.visit.querySelector(`#adding-doctor-fields`);
      insertAfterNode.innerHTML = ``;

      switch (doctor.value) {
        case "Кардіолог":
          const { VisitCardiologist } = await import("./VisitCardiologist.js");
          const cardiologist = new VisitCardiologist(this.visit);
          cardiologist.render(this.visit);
          console.log("Кардіолог - додаткові поля");
          break;
        case "Стоматолог":
          const { VisitDentist } = await import("./VisitDentist.js");
          const dentist = new VisitDentist(this.visit);
          dentist.render(this.visit);
          console.log("Стоматолог - додаткові поля");
          break;
        case "Терапевт":
          const { VisitTherapist } = await import("./VisitTherapist.js");
          const therapist = new VisitTherapist(this.visit);
          therapist.render(this.visit);
          console.log("Терапевт - додаткові поля");
          break;
      }
    });
  }
  render(parent) {
    if (document.getElementById(`create-visit`)) {
      return;
    }
    parent.after(this.visit);

    this.handleDoctorChange();

    this.visit.addEventListener(`submit`, (event) => {
      event.preventDefault();
      const visit = Object.fromEntries(new FormData(this.visit));
      console.log(visit); // тут робиться  запрос на сервер
      this.renderVisitCard();
      console.log("Візит створено");
      this.visit.remove();
    });
    const btnCloseVisit = this.visit.querySelector(`.close`);
    btnCloseVisit.addEventListener(`click`, (event) => {
      event.preventDefault();
      this.visit.remove();
    });
  }
  renderVisitCard() {
    const root = document.getElementById(`root`);
    const visitCard = document.createElement(`div`);
    visitCard.className = "visit-card";
    visitCard.innerHTML = `
    <button type="button" class="close">X</button>
    <p>ПІБ пацієнта: ${this.visit.fullName.value}</p>
    <p>Доктор: ${this.visit.doctor.value}</p>
    <p>Мета візиту: ${this.visit.visitPurpose.value}</p>
    <p>Короткий опис візиту: ${this.visit.visitDescription.value}</p>
    <p>Ступінь терміновості: ${this.visit.priority.value}</p>
    <div id="visit-full-info"></div>
    <button type="button" class="show-more">Показати більше</button>
    <button type="button" class="edit-visit">Редагувати</button>
    `;
    root.append(visitCard);
  }
}

export default Visit;
