import Visit from "./Visit.js";

class VisitTherapist extends Visit {
  constructor(visit) {
    super(visit);
  }

  render() {
    const insertAfterNode = this.visit.querySelector(`#priority`);
    insertAfterNode.insertAdjacentHTML(
      `afterend`,
      `<input type="number" name="age" placeholder="Вік"> `
    );
  }
}

export { VisitTherapist };
