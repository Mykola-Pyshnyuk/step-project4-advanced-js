import Visit from "./Visit.js";

class VisitDentist extends Visit {
  constructor(visit) {
    super(visit);
  }
  render() {
    const insertAfterNode = this.visit.querySelector(`#priority`);
    insertAfterNode.insertAdjacentHTML(
      `afterend`,
      `<input type="text" name="visitDate" placeholder="Дата останього візиту">`
    );
  }
}

export { VisitDentist };
