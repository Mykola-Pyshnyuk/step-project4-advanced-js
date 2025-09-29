import API_URL from "../constants/api.js";

import Request from "./Request.js";

const request = new Request(API_URL);

export const loginRequest = (loginUser) => request.loginRequest(loginUser);
