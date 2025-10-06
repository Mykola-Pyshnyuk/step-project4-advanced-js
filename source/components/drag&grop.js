function dragDrop() {
  const visitCards = document.querySelectorAll(".visit-card");
  const container = document.querySelector("#root");

  visitCards.forEach((card) => {
    card.addEventListener("dragstart", () => {
      console.log("ok");
    });
  });
}

export default dragDrop;
