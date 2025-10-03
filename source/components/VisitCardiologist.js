import Visit from "./Visit.js";

class VisitCardiologist extends Visit {
  constructor(visit) {
    super(visit);
  }

  render() {
    const insertAfterNode = this.visit.querySelector(`#adding-doctor-fields`);
    insertAfterNode.insertAdjacentHTML(
      `afterbegin`,
      `
      <input type="number" name="bloodPressure" placeholder="Звичайний тиск ">
      <input type="number" name="bodyMassIndex" placeholder="Індекс маси тіла">
      <input type="text" name="heartDisease" placeholder="перенесені захворювання серцево-судинної системи ">
      <input type="number" name="age" placeholder="Вік">
      `
    );
  }
}

export { VisitCardiologist };
