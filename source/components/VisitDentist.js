class VisitDentist {
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
      `<input type="date" min="2025-01-01" name="visitDate" placeholder="Дата останнього візиту" required>`
    );
  }
}

export { VisitDentist };
