const BASE_URL = "http://127.0.0.1:8000/api/v1";

const URL_REGISTRATION = `${BASE_URL}/auth/registration/`;
const URL_LOGIN = `${BASE_URL}/auth/login/`;
const URL_GUEST_LOGIN = `${BASE_URL}/auth/guest-login/`;
const URL_LOGOUT = `${BASE_URL}/auth/logout/`;

const URL_USERS = `${BASE_URL}/auth/users/`;
const URL_TASKS = `${BASE_URL}/tasks/`;
const URL_SUBTASKS = `${BASE_URL}/subtasks/`;
const URL_CATEGORIES = `${BASE_URL}/categories/`;
const URL_CONTACTS = `${BASE_URL}/contacts/`;
const URL_SUMMARY = `${BASE_URL}/summary/`;

let TOKEN;

async function sendRequest(method, url, payload = null) {
  const options = {
    method: method.toUpperCase(),
    headers: getHeaders(),
  };

  if (!isGetMethod(method)) {
    options.body = addPayload(payload);
  }

  return await fetchAndHandleResponse(url, options);
}

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };
  if (TOKEN) {
    headers.Authorization = `Token ${TOKEN}`;
  }
  return headers;
}

function isGetMethod(method) {
  return method == "GET";
}

function addPayload(payload) {
  return JSON.stringify(payload);
}

async function fetchAndHandleResponse(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return;
  } catch (error) {
    throw new Error("Fehler bei der Anfrage: " + error.message);
  }
}
