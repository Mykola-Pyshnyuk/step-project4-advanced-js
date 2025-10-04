import Visit from "./Visit.js";

class VisitTherapist extends Visit {
  constructor(visit) {
    super(visit);
  }

  render() {
    const insertAfterNode = this.visit.querySelector(`#adding-doctor-fields`);
    insertAfterNode.insertAdjacentHTML(
      `afterbegin`,
      `<input type="number" name="age" placeholder="Вік"> `
    );
  }

  renderVisitCard(visitFullInfo, { age }) {
    visitFullInfo.innerHTML = `<p>Вік: ${age}</p>`;
  }
}

export { VisitTherapist };
