import Visit from "./Visit.js";

class VisitDentist extends Visit {
  constructor(visit) {
    super(visit);
  }
  render() {
    const insertAfterNode = this.visit.querySelector(`#adding-doctor-fields`);
    insertAfterNode.insertAdjacentHTML(
      `afterbegin`,
      `<input type="date" min="2025-01-01" name="visitDate" placeholder="Дата останього візиту">`
    );
  }
}

export { VisitDentist };
