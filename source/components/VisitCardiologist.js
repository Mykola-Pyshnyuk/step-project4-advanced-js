class VisitCardiologist {
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
      `
      <input type="number" name="bloodPressure" placeholder="Звичайний тиск" required>
      <input type="number" name="bodyMassIndex" placeholder="Індекс маси тіла" required>
      <input type="text" name="heartDisease" placeholder="Перенесені захворювання серцево-судинної системи" required>
      <input type="number" name="age" placeholder="Вік" required>
      `
    );
  }

  renderVisitCard(
    visitFullInfo,
    { bloodPressure, bodyMassIndex, heartDisease, age }
  ) {
    visitFullInfo.innerHTML = `
    <p>Звичайний тиск: ${bloodPressure}</p>
    <p>Індекс маси тіла: ${bodyMassIndex}</p>
    <p>Перенесені захворювання: ${(heartDisease = "Немає")}</p>
    <p>Вік: ${age}</p>
    `;
  }
}

export { VisitCardiologist };
