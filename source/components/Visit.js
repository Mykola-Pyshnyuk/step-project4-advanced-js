//* при натискані на кнопку створити візит зявляється модальне вікно для заповнення інформації про візит, коли вибираємо саме який доктор нам потрібен зявляються ще поля для заповнення інформації
//? створити метод в Modal який відкриває модальне вікно для заповнення інформації про візит а в цьому класі відслідковувати який доктор був вибраний ( створити switch case в якому при виборі конкретоного доктора викликається його під Клас в якому вже додаються поля ) також треба родумати логіку при завантажені сторінки має створюватись картки з однаковою інформацією а при натиску на них має зявитись повна інформація про візит

//* тобто в кожному підкласі візиту має бути свій рендер та при завантажені сторінки також викликати рендер відповідного класу ( потрібно буде якось відслідковувати який доктор був вибраний і викликати рендер відповідного класу )

//? також кожен підклас Візиту має мати змогу взаємодіяти з класом Request в якому створяться відповідні методи
class Visit {
  constructor(visit) {
    this.visit = visit;
  }

  handleDoctorChange() {
    const doctor = this.visit.querySelector(`#doctor`);
    doctor.addEventListener(`change`, async (event) => {
      event.preventDefault();

      switch (doctor.value) {
        case "cardiologist":
          const { VisitCardiologist } = await import("./VisitCardiologist.js");
          const cardiologist = new VisitCardiologist(this.visit);
          cardiologist.render(this.visit);
          console.log("cardiologist - додаткові поля");
          break;
        case "dentist":
          const { VisitDentist } = await import("./VisitDentist.js");
          const dentist = new VisitDentist(this.visit);
          dentist.render(this.visit);
          console.log("dentist - додаткові поля");
          break;
        case "therapist":
          const { VisitTherapist } = await import("./VisitTherapist.js");
          const therapist = new VisitTherapist(this.visit);
          therapist.render(this.visit);
          console.log("therapist - додаткові поля");
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
      console.log("Візит створено");
      this.visit.remove();
    });
    const btnCloseVisit = this.visit.querySelector(`.close`);
    btnCloseVisit.addEventListener(`click`, (event) => {
      event.preventDefault();
      this.visit.remove();
    });
  }
}

export default Visit;
