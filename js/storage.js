const BASE_URL = "http://127.0.0.1:8000/api/v1";

const URL_REGISTRATION = `${BASE_URL}/auth/registration/`;
const URL_LOGIN = `${BASE_URL}/auth/login/`;
const URL_GUEST_LOGIN = `${BASE_URL}/auth/guest-login/`;
const URL_LOGOUT = `${BASE_URL}/auth/logout/`;

const URL_USERS = `${BASE_URL}/users/`;
const URL_TASKS = `${BASE_URL}/tasks/`;
const URL_SUBTASKS = `${BASE_URL}/subtasks/`;
const URL_CATEGORIES = `${BASE_URL}/categories/`;
const URL_CONTACTS = `${BASE_URL}/contacts/`;
const URL_SUMMARY = `${BASE_URL}/summary/`;

let TOKEN;
let PAYLOAD;

/**
 * Sends an HTTP request with the specified method, URL, and optional payload,
 * and handles the response centrally.
 * @param {string} method - The HTTP method to be used (e.g., 'GET', 'POST', etc.).
 * @param {string} url - The URL to which the request will be sent.
 * @returns {Promise<void>} - Resolves when the request is successfully processed.
 */
async function sendRequest(method, url) {
  const options = {
    method: method.toUpperCase(),
    headers: getHeaders(),
  };

  if (!isGetMethod(method)) {
    options.body = addPayload();
  }

  return await fetchAndHandleResponse(url, options);
}

/**
 * Constructs the headers object for the HTTP request.
 * Includes the 'Authorization' header if a TOKEN is available.
 * @returns {Object} - The headers for the request, including 'Content-Type' and optional 'Authorization'.
 */
function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };
  if (TOKEN) {
    headers.Authorization = `Token ${TOKEN}`;
  }
  return headers;
}

/**
 * Checks if the provided method is a GET method without any payload.
 * @param {string} method - The HTTP method to check.
 * @returns {boolean} - Returns true if the method is 'GET' and no payload is provided.
 */
function isGetMethod(method) {
  return method == "GET";
}

/**
 * Converts the PAYLOAD object to a JSON string for use in request bodies.
 * @returns {string} - A JSON string representation of the PAYLOAD.
 */
function addPayload() {
  return JSON.stringify(PAYLOAD);
}

/**
 * Funktion, um eine API-Anfrage zu senden und die Antwort zu verarbeiten.
 * @param {string} url - Die URL der API.
 * @param {Object} options - Die Optionen für die Anfrage (z.B. Methode, Header, etc.)
 * @returns {Promise<Object|string>} - Gibt die Antwort als JSON oder Text zurück.
 */
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
