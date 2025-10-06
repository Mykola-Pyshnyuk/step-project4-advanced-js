import { getCards, createCard, updateCard, deleteCard } from "./index.js";

const FIELD_LABELS = {
  fullName: "ПІБ пацієнта",
  doctor: "Лікар",
  visitPurpose: "Мета візиту",
  visitDescription: "Опис візиту",
  priority: "Терміновість",
  status: "Статус",
  bloodPressure: "Артеріальний тиск",
  bodyMassIndex: "Індекс маси тіла",
  heartDisease: "Серцево-судинні захворювання",
  age: "Вік",
  lastVisitDate: "Дата останнього візиту",
  visitDate: "Дата останнього візиту",
  weight: "Вага",
  pressure: "Тиск",
  temperature: "Температура",
  residence: "Місце проживання",
  additionalInfo: "Додаткова інформація",
};

const STATUS_LABELS = {
  open: "Активна",
  done: "Завершена",
};

const PRIORITY_LABELS = {
  low: "Низький",
  normal: "Середній",
  high: "Високий",
};

const SELECT_OPTIONS = {
  doctor: [
    { value: "Кардіолог", label: "Кардіолог" },
    { value: "Стоматолог", label: "Стоматолог" },
    { value: "Терапевт", label: "Терапевт" },
  ],
  status: [
    { value: "open", label: STATUS_LABELS.open },
    { value: "done", label: STATUS_LABELS.done },
  ],
  priority: [
    { value: "low", label: PRIORITY_LABELS.low },
    { value: "normal", label: PRIORITY_LABELS.normal },
    { value: "high", label: PRIORITY_LABELS.high },
  ],
};

const CARD_MAIN_FIELDS = [
  "fullName",
  "doctor",
  "visitPurpose",
  "visitDescription",
  "priority",
  "status",
];
const CARD_EXTRA_FIELDS = [
  "bloodPressure",
  "bodyMassIndex",
  "heartDisease",
  "age",
  "lastVisitDate",
  "visitDate",
  "weight",
  "pressure",
  "temperature",
  "residence",
  "additionalInfo",
];

const EDITABLE_FIELDS = CARD_MAIN_FIELDS.concat(CARD_EXTRA_FIELDS);

const EMPTY_STATE_ID = "cards-empty-state";
const DEFAULT_EMPTY_TEXT = "Ще немає карток";
const OVERLAY_CLASS = "card-edit-overlay";

const NOTIFICATION_STYLES = {
  info: { background: "#e0f2fe", color: "#1d4ed8" },
  success: { background: "#dcfce7", color: "#15803d" },
  error: { background: "#fee2e2", color: "#b91c1c" },
};

const state = {
  cards: [],
  filters: { status: "", priority: "", search: "" },
  tempId: 0,
  notificationTimer: null,
};

let activeOverlayEscHandler = null;

function getRootNode() {
  return document.getElementById("root");
}

function getEmptyNode() {
  return document.getElementById(EMPTY_STATE_ID);
}

function showEmptyMessage(text) {
  const node = getEmptyNode();

  if (!node) {
    return;
  }

  node.textContent = text || DEFAULT_EMPTY_TEXT;
  node.style.display = "block";
}

function hideEmptyMessage() {
  const node = getEmptyNode();

  if (!node) {
    return;
  }

  node.style.display = "none";
}

function showNotification(message, type = "info") {
  const box = document.getElementById("cards-notification");

  if (!box) {
    return;
  }

  const style = NOTIFICATION_STYLES[type] || NOTIFICATION_STYLES.info;

  box.textContent = message;
  box.style.display = "block";
  box.style.backgroundColor = style.background;
  box.style.color = style.color;

  if (state.notificationTimer) {
    clearTimeout(state.notificationTimer);
  }

  state.notificationTimer = window.setTimeout(function () {
    box.style.display = "none";
  }, 2500);
}

function normalizeStatus(value) {
  const normalized = (value || "").toString().trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  if (normalized === "done" || normalized === "завершена") {
    return "done";
  }

  return "open";
}

function normalizePriority(value) {
  const normalized = (value || "").toString().trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  const priorityMap = {
    low: "low",
    низький: "low",
    низька: "low",
    high: "high",
    високий: "high",
    висока: "high",
    normal: "normal",
    середній: "normal",
    середня: "normal",
  };

  return priorityMap[normalized] || normalized;
}

function getStatusLabel(value) {
  const key = normalizeStatus(value) || "open";
  return STATUS_LABELS[key] || value || "-";
}

function getPriorityLabel(value) {
  const key = normalizePriority(value) || "normal";
  return PRIORITY_LABELS[key] || value || "-";
}

function formatValue(fieldName, value) {
  if (fieldName === "status") {
    return getStatusLabel(value);
  }

  if (fieldName === "priority") {
    return getPriorityLabel(value);
  }

  if (value === 0) {
    return "0";
  }

  return value || "-";
}

function cloneCard(card) {
  const copy = {};

  Object.keys(card || {}).forEach(function (key) {
    copy[key] = card[key];
  });

  copy.status = normalizeStatus(copy.status) || "open";
  copy.priority = normalizePriority(copy.priority) || "normal";
  copy.localId = card && card.id ? String(card.id) : generateTempId();

  return copy;
}

function generateTempId() {
  state.tempId += 1;
  return "tmp-" + state.tempId;
}

function removeEditOverlay() {
  const overlay = document.querySelector("." + OVERLAY_CLASS);

  if (overlay) {
    overlay.remove();
  }

  if (activeOverlayEscHandler) {
    document.removeEventListener("keydown", activeOverlayEscHandler);
    activeOverlayEscHandler = null;
  }
}

function matchesFilters(card) {
  if (!card) {
    return false;
  }

  if (state.filters.status) {
    if (normalizeStatus(card.status) !== state.filters.status) {
      return false;
    }
  }

  if (state.filters.priority) {
    if (normalizePriority(card.priority) !== state.filters.priority) {
      return false;
    }
  }

  if (state.filters.search) {
    const haystack = [
      card.fullName,
      card.doctor,
      card.visitPurpose,
      card.visitDescription,
      card.additionalInfo,
      card.residence,
      getStatusLabel(card.status),
      getPriorityLabel(card.priority),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(state.filters.search)) {
      return false;
    }
  }

  return true;
}

function createCardElement(card) {
  const cardBox = document.createElement("div");
  cardBox.className = "visit-card";
  cardBox.dataset.cardId = card.localId;
  cardBox.draggable = true;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "close";
  closeButton.textContent = "X";
  cardBox.appendChild(closeButton);

  CARD_MAIN_FIELDS.forEach(function (field) {
    appendInfoLine(cardBox, field, card[field]);
  });

  const detailsBox = document.createElement("div");
  detailsBox.className = "visit-details";
  detailsBox.style.display = "none";

  CARD_EXTRA_FIELDS.forEach(function (field) {
    if (
      card[field] !== undefined &&
      card[field] !== null &&
      card[field] !== ""
    ) {
      appendInfoLine(detailsBox, field, card[field]);
    }
  });

  cardBox.appendChild(detailsBox);

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "show-more";
  toggleButton.textContent = "Показати більше";
  cardBox.appendChild(toggleButton);

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-visit";
  editButton.textContent = "Редагувати";
  cardBox.appendChild(editButton);

  toggleButton.addEventListener("click", function () {
    const isHidden = detailsBox.style.display === "none";
    detailsBox.style.display = isHidden ? "block" : "none";
    toggleButton.textContent = isHidden ? "Сховати" : "Показати більше";
  });

  closeButton.addEventListener("click", function () {
    if (!card.id) {
      showNotification("Немає ідентифікатора картки для видалення", "error");
      return;
    }

    if (!window.confirm("Видалити картку?")) {
      return;
    }

    deleteCard(card.id)
      .then(function () {
        state.cards = state.cards.filter(function (item) {
          return item.localId !== card.localId;
        });
        renderCards();
        showNotification("Картку видалено", "success");
      })
      .catch(function () {
        showNotification("Не вдалося видалити картку", "error");
      });
  });

  editButton.addEventListener("click", function () {
    openEditModal(card);
  });

  return cardBox;
}

function appendInfoLine(parent, fieldName, value) {
  const line = document.createElement("p");
  line.textContent =
    (FIELD_LABELS[fieldName] || fieldName) +
    ": " +
    formatValue(fieldName, value);
  parent.appendChild(line);
}

function openEditModal(card) {
  removeEditOverlay();

  const overlay = document.createElement("div");
  overlay.className = OVERLAY_CLASS;
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.right = "0";
  overlay.style.bottom = "0";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "16px";
  overlay.style.zIndex = "999";

  const modal = document.createElement("div");
  modal.style.backgroundColor = "#ffffff";
  modal.style.padding = "16px";
  modal.style.borderRadius = "10px";
  modal.style.width = "min(520px, 94vw)";
  modal.style.maxHeight = "80vh";
  modal.style.overflow = "hidden";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.gap = "12px";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const title = document.createElement("h3");
  title.textContent = "Редагування картки";
  title.style.margin = "0";
  header.appendChild(title);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "×";
  closeButton.style.fontSize = "20px";
  closeButton.style.lineHeight = "1";
  closeButton.style.border = "none";
  closeButton.style.background = "transparent";
  closeButton.style.cursor = "pointer";
  header.appendChild(closeButton);

  modal.appendChild(header);

  const form = document.createElement("form");
  form.className = "card-edit-form";
  form.style.display = "flex";
  form.style.flexDirection = "column";
  form.style.gap = "12px";
  form.style.flex = "1";

  const fieldsWrapper = document.createElement("div");
  fieldsWrapper.style.display = "grid";
  fieldsWrapper.style.gridTemplateColumns =
    "repeat(auto-fill, minmax(200px, 1fr))";
  fieldsWrapper.style.gap = "8px";
  fieldsWrapper.style.maxHeight = "50vh";
  fieldsWrapper.style.overflowY = "auto";

  EDITABLE_FIELDS.forEach(function (field) {
    fieldsWrapper.appendChild(buildEditField(field, card[field] || ""));
  });

  form.appendChild(fieldsWrapper);

  const buttonsRow = document.createElement("div");
  buttonsRow.style.display = "flex";
  buttonsRow.style.justifyContent = "flex-end";
  buttonsRow.style.gap = "8px";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Скасувати";
  cancelButton.style.padding = "6px 16px";

  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = "Зберегти";
  saveButton.style.padding = "6px 16px";
  saveButton.style.backgroundColor = "#2563eb";
  saveButton.style.color = "#ffffff";
  saveButton.style.border = "1px solid #2563eb";
  saveButton.style.borderRadius = "6px";

  buttonsRow.appendChild(cancelButton);
  buttonsRow.appendChild(saveButton);
  form.appendChild(buttonsRow);

  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  let isClosed = false;

  function closeOverlay() {
    if (isClosed) {
      return;
    }

    isClosed = true;
    document.removeEventListener("keydown", handleKeydown);
    activeOverlayEscHandler = null;
    overlay.remove();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeOverlay();
    }
  }

  document.addEventListener("keydown", handleKeydown);
  activeOverlayEscHandler = handleKeydown;

  closeButton.addEventListener("click", closeOverlay);
  cancelButton.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeOverlay();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!card.id) {
      showNotification("Немає ідентифікатора картки", "error");
      return;
    }

    const formData = new FormData(form);
    const updatedCard = {};

    formData.forEach(function (value, key) {
      updatedCard[key] = value;
    });

    updatedCard.status = normalizeStatus(updatedCard.status) || "open";
    updatedCard.priority = normalizePriority(updatedCard.priority) || "normal";

    updateCard(card.id, updatedCard)
      .then(function (savedCard) {
        const mergedCard =
          savedCard || Object.assign({}, card, updatedCard, { id: card.id });
        const freshCard = cloneCard(mergedCard);

        state.cards = state.cards.map(function (item) {
          if (item.localId === card.localId) {
            return freshCard;
          }
          return item;
        });

        closeOverlay();
        showNotification("Картку оновлено", "success");
        renderCards();
      })
      .catch(function () {
        showNotification("Не вдалося оновити картку", "error");
      });
  });
}

function buildEditField(fieldName, value) {
  const field = document.createElement("label");
  field.style.display = "flex";
  field.style.flexDirection = "column";
  field.style.gap = "4px";

  const caption = document.createElement("span");
  caption.textContent = FIELD_LABELS[fieldName] || fieldName;
  field.appendChild(caption);

  if (SELECT_OPTIONS[fieldName]) {
    const select = document.createElement("select");
    select.name = fieldName;

    SELECT_OPTIONS[fieldName].forEach(function (optionData) {
      const option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      if (optionData.value === (value || "")) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    field.appendChild(select);
    return field;
  }

  const input = document.createElement("input");
  input.type = "text";
  input.name = fieldName;
  input.value = value || "";
  field.appendChild(input);

  return field;
}

function applyFiltersFromForm(form) {
  const previousFilters = Object.assign({}, state.filters);
  const formData = new FormData(form);

  state.filters.status = normalizeStatus(formData.get("status"));
  state.filters.priority = normalizePriority(formData.get("priority"));
  state.filters.search = (formData.get("search") || "").trim().toLowerCase();

  renderCards();

  if (
    previousFilters.status !== state.filters.status ||
    previousFilters.priority !== state.filters.priority ||
    previousFilters.search !== state.filters.search
  ) {
    showNotification("Фільтри застосовано", "info");
  }
}

function setupFilters() {
  const filterForm = document.getElementById("filterForm");

  if (!filterForm) {
    return;
  }

  applyFiltersFromForm(filterForm);

  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    applyFiltersFromForm(filterForm);
  });

  filterForm.addEventListener("change", function (event) {
    if (
      event.target &&
      (event.target.name === "status" || event.target.name === "priority")
    ) {
      applyFiltersFromForm(filterForm);
    }
  });

  const searchInput = filterForm.querySelector('input[name="search"]');

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.filters.search = searchInput.value.trim().toLowerCase();
      renderCards();
    });
  }
}

function setupEmptyPlaceholder() {
  const section = document.querySelector("section");

  if (!section) {
    return;
  }

  let placeholder = document.getElementById(EMPTY_STATE_ID);

  if (!placeholder) {
    placeholder = section.querySelector("h4");

    if (!placeholder) {
      placeholder = document.createElement("h4");
      section.insertBefore(placeholder, section.firstChild || null);
    } else if (placeholder !== section.firstChild) {
      section.insertBefore(placeholder, section.firstChild || null);
    }
  }

  placeholder.id = EMPTY_STATE_ID;
  placeholder.textContent = DEFAULT_EMPTY_TEXT;
}

function renderCards() {
  const root = getRootNode();

  if (!root) {
    return;
  }

  removeEditOverlay();
  root.innerHTML = "";

  const filteredCards = state.cards.filter(matchesFilters);

  if (filteredCards.length === 0) {
    const hasFilters = Boolean(
      state.filters.status || state.filters.priority || state.filters.search
    );
    showEmptyMessage(
      hasFilters
        ? "За вибраними фільтрами картки не знайдено"
        : DEFAULT_EMPTY_TEXT
    );

    if (hasFilters) {
      showNotification("За вибраними фільтрами картки не знайдено", "info");
    }

    return;
  }

  hideEmptyMessage();

  filteredCards.forEach(function (card) {
    root.appendChild(createCardElement(card));
  });

  dragDrop();
}

export function clearCardsUI() {
  const root = getRootNode();

  if (root) {
    root.innerHTML = "";
  }

  state.cards = [];
  state.tempId = 0;
  removeEditOverlay();
  showEmptyMessage(DEFAULT_EMPTY_TEXT);
}

export function loadCards() {
  const root = getRootNode();

  if (!root) {
    return Promise.resolve();
  }

  showEmptyMessage("Завантаження карток...");

  return getCards()
    .then(function (cards) {
      if (!Array.isArray(cards)) {
        showNotification("Очікувався масив карток", "error");
        showEmptyMessage("Не вдалося отримати картки");
        return;
      }

      state.tempId = 0;
      state.cards = cards.map(cloneCard);
      renderCards();
    })
    .catch(function () {
      showEmptyMessage("Не вдалося завантажити картки");
      showNotification(
        "Не вдалося завантажити картки. Спробуйте ще раз.",
        "error"
      );
    });
}

export function handleCreateCardFromForm(visitInstance) {
  if (!visitInstance || !visitInstance.visit) {
    return Promise.resolve();
  }

  const formData = new FormData(visitInstance.visit);
  const payload = {};

  formData.forEach(function (value, key) {
    payload[key] = value;
  });

  payload.status = normalizeStatus(payload.status) || "open";
  payload.priority = normalizePriority(payload.priority) || "normal";

  return createCard(payload)
    .then(function (createdCard) {
      const mergedCard = createdCard || payload;
      const freshCard = cloneCard(mergedCard);

      state.cards.push(freshCard);
      showNotification("Картку створено", "success");
      renderCards();
      return createdCard;
    })
    .catch(function () {
      showNotification(
        "Не вдалося створити картку. Перевірте дані та спробуйте ще раз.",
        "error"
      );
    });
}

document.addEventListener("user-logged-in", function () {
  loadCards();
});

document.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("logout-yes")) {
    clearCardsUI();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  setupEmptyPlaceholder();
  setupFilters();
});

//! ці функції малаб бути методами класу але картки візитів створюються тут тому і тут викликаються
function dragDrop() {
  const visitCards = document.querySelectorAll(".visit-card");
  const container = document.querySelector("#root");

  visitCards.forEach((card) => {
    card.addEventListener("dragstart", () => {
      card.style.opacity = "0.7";
      card.classList.add("dragging");
      console.log("grag-start");
    });

    card.addEventListener("dragend", () => {
      card.removeAttribute("style");
      card.classList.remove("dragging");
      console.log("drag-end");
    });
  });

  container.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const card = document.querySelector(".dragging");

    const dropPosition = getDropPosition(
      container,
      event.clientY,
      event.clientX
    );

    if (dropPosition) {
      container.insertBefore(card, dropPosition);
    } else {
      container.append(card);
    }
  });
}

function getDropPosition(container, cordinatY, cordinatX) {
  const dragCards = [
    ...container.querySelectorAll(".visit-card:not(.dragging)"),
  ]; //? всі картки візитів крім тієї що перетягується

  for (const card of dragCards) {
    const cardPosition = card.getBoundingClientRect();
    if (
      cordinatY < cardPosition.bottom &&
      cordinatX < cardPosition.right - 120 // * віднімаю щоб приблизно попадати на картку
    ) {
      return card;
    }
  }
  return null;
}
