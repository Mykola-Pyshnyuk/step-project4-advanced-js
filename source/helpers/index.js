import API_URL from "../constants/api.js";

import Request from "./Request.js";

const request = new Request(API_URL);

export const loginRequest = (loginUser) => request.loginRequest(loginUser);
export const getCards = () => request.getCards();
export const createCard = (cardData) => request.createCard(cardData);
export const updateCard = (cardId, cardData) => request.updateCard(cardId, cardData);
export const deleteCard = (cardId) => request.deleteCard(cardId);
