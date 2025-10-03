import { getCards, createCard, updateCard, deleteCard } from "./index.js";

let defaultEmptyText = null;

function getRoot() {
  return document.getElementById("root");
}

function getEmptyNode() {
  return document.querySelector("section h4");
}

function rememberDefaultText() {
  if (defaultEmptyText !== null) {
    return;
  }

  const emptyNode = getEmptyNode();
  if (emptyNode) {
    defaultEmptyText = emptyNode.textContent || "";
  }
}

function setEmptyMessage(text) {
  const emptyNode = getEmptyNode();

  if (!emptyNode) {
    return;
  }

  rememberDefaultText();

  if (typeof text === "string" && text.length > 0) {
    emptyNode.textContent = text;
  } else {
    emptyNode.textContent = defaultEmptyText || "";
  }

  emptyNode.style.display = "block";
}

function hideEmptyMessage() {
  const emptyNode = getEmptyNode();

  if (!emptyNode) {
    return;
  }

  emptyNode.style.display = "none";
}

export function clearCardsUI() {
  const root = getRoot();

  if (root) {
    root.innerHTML = "";
  }

  setEmptyMessage();
}

export function loadCards() {
  const root = getRoot();

  if (!root) {
    return Promise.resolve();
  }

  root.innerHTML = "";
  setEmptyMessage("Завантаження карток...");

  return getCards()
    .then(function (cards) {
      root.innerHTML = "";

      if (Array.isArray(cards) && cards.length > 0) {
        hideEmptyMessage();

        for (let index = 0; index < cards.length; index += 1) {
          renderCard(cards[index]);
        }
      } else {
        setEmptyMessage();
      }
    })
    .catch(function (error) {
      console.error(error);
      setEmptyMessage("Не вдалося завантажити картки");
      alert("Не вдалося завантажити картки. Перевірте дані та спробуйте ще раз.");
    });
}

function renderCard(card) {
  const root = getRoot();

  if (!root || !card) {
    return;
  }

  hideEmptyMessage();

  const visitCard = document.createElement("div");
  visitCard.className = "visit-card";
  visitCard.dataset.cardId = card.id;

  try {
    visitCard.dataset.card = JSON.stringify(card);
  } catch (error) {
    visitCard.dataset.card = "{}";
  }

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "close";
  closeButton.textContent = "X";
  visitCard.appendChild(closeButton);

  const fullNameLine = document.createElement("p");
  fullNameLine.textContent = "ПІБ пацієнта: " + (card.fullName || "");
  visitCard.appendChild(fullNameLine);

  const doctorLine = document.createElement("p");
  doctorLine.textContent = "Доктор: " + (card.doctor || "");
  visitCard.appendChild(doctorLine);

  const purposeLine = document.createElement("p");
  purposeLine.textContent = "Мета візиту: " + (card.visitPurpose || "");
  visitCard.appendChild(purposeLine);

  const descriptionLine = document.createElement("p");
  descriptionLine.textContent = "Короткий опис візиту: " + (card.visitDescription || "");
  visitCard.appendChild(descriptionLine);

  const priorityLine = document.createElement("p");
  priorityLine.textContent = "Ступінь терміновості: " + (card.priority || "");
  visitCard.appendChild(priorityLine);

  const detailsContainer = document.createElement("div");
  detailsContainer.id = "visit-full-info";
  detailsContainer.style.display = "none";

  const cardKeys = Object.keys(card);
  for (let index = 0; index < cardKeys.length; index += 1) {
    const key = cardKeys[index];

    if (
      key === "id" ||
      key === "fullName" ||
      key === "doctor" ||
      key === "visitPurpose" ||
      key === "visitDescription" ||
      key === "priority"
    ) {
      continue;
    }

    const value = card[key];

    if (value === "" || value === null || typeof value === "undefined") {
      continue;
    }

    const detailLine = document.createElement("p");
    detailLine.textContent = key + ": " + value;
    detailsContainer.appendChild(detailLine);
  }

  visitCard.appendChild(detailsContainer);

  const showMoreButton = document.createElement("button");
  showMoreButton.type = "button";
  showMoreButton.className = "show-more";
  showMoreButton.textContent = "Показати більше";
  visitCard.appendChild(showMoreButton);

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-visit";
  editButton.textContent = "Редагувати";
  visitCard.appendChild(editButton);

  root.appendChild(visitCard);

  showMoreButton.addEventListener("click", function () {
    if (detailsContainer.style.display === "none") {
      detailsContainer.style.display = "block";
      showMoreButton.textContent = "Сховати";
    } else {
      detailsContainer.style.display = "none";
      showMoreButton.textContent = "Показати більше";
    }
  });

  closeButton.addEventListener("click", function () {
    if (!confirm("Видалити картку?")) {
      return;
    }

    deleteCard(card.id)
      .then(function () {
        loadCards();
      })
      .catch(function (error) {
        console.error(error);
        alert("Не вдалося видалити картку.");
      });
  });

  editButton.addEventListener("click", function () {
    startEditCard(visitCard);
  });
}

function startEditCard(cardElement) {
  const storedCard = cardElement.dataset.card || "{}";
  let cardData;

  try {
    cardData = JSON.parse(storedCard);
  } catch (error) {
    cardData = {};
  }

  if (!cardData || !cardData.id) {
    alert("Не вдалося знайти дані картки.");
    return;
  }

  const updatedCard = {};
  const keys = Object.keys(cardData);

  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];

    if (key === "id") {
      updatedCard[key] = cardData[key];
      continue;
    }

    let currentValue = cardData[key];

    if (currentValue === null || typeof currentValue === "undefined") {
      currentValue = "";
    }

    const newValue = prompt("Введіть значення для " + key, currentValue);

    if (newValue === null) {
      return;
    }

    updatedCard[key] = newValue;
  }

  if (!updatedCard.id) {
    updatedCard.id = cardData.id;
  }

  updateCard(cardData.id, updatedCard)
    .then(function () {
      loadCards();
    })
    .catch(function (error) {
      console.error(error);
      alert("Не вдалося оновити картку.");
    });
}

export function handleCreateCardFromForm(visitInstance) {
  if (!visitInstance || !visitInstance.visit) {
    return Promise.resolve();
  }

  const formData = new FormData(visitInstance.visit);
  const cardData = {};

  formData.forEach(function (value, key) {
    cardData[key] = value;
  });

  return createCard(cardData)
    .then(function () {
      return loadCards();
    })
    .catch(function (error) {
      console.error(error);
      alert("Не вдалося створити картку. Перевірте дані і спробуйте ще раз.");
      throw error;
    });
}

document.addEventListener("user-logged-in", function () {
  loadCards();
});

document.addEventListener("click", function (event) {
  const target = event.target;

  if (target && target.classList.contains("logout-yes")) {
    clearCardsUI();
  }
});
