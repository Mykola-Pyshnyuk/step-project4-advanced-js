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
