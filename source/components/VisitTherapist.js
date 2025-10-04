class VisitTherapist {
  constructor(visit) {
    this.visit = visit;
  }

  render() {
    const insertAfterNode = this.visit.querySelector(`#adding-doctor-fields`);
    if (!insertAfterNode) {
      return;
    }
    insertAfterNode.insertAdjacentHTML(
      `afterbegin`,
      `<input type="number" name="age" placeholder="Вік" required>`
    );
  }

  renderVisitCard(visitFullInfo, { age }) {
    visitFullInfo.innerHTML = `<p>Вік: ${age}</p>`;
  }
}

export { VisitTherapist };
