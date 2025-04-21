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

/**
 * Sends an HTTP request with the given method, URL, and optional payload.
 * @param {string} method - HTTP method (e.g., "GET", "POST").
 * @param {string} url - Endpoint URL.
 * @param {Object} [payload=null] - Optional payload for non-GET requests.
 * @returns {Promise<any>} Parsed JSON response or undefined.
 * @throws {Error} If the request fails or returns a non-OK response.
 */
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

/**
 * Returns the HTTP headers for requests, including auth token if available.
 * @returns {Object} Headers object.
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
 * Checks if the given method is a GET request.
 * @param {string} method - HTTP method.
 * @returns {boolean} True if method is "GET", else false.
 */
function isGetMethod(method) {
  return method == "GET";
}

/**
 * Converts a payload object to a JSON string.
 * @param {Object} payload - Data to send.
 * @returns {string} JSON stringified payload.
 */
function addPayload(payload) {
  return JSON.stringify(payload);
}

/**
 * Performs fetch and handles response including error handling and JSON parsing.
 * @param {string} url - The endpoint URL.
 * @param {Object} options - Fetch options including method, headers, body.
 * @returns {Promise<any>} Parsed JSON response or undefined.
 * @throws {Error} If the response is not ok or fetch fails.
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
    throw new Error("Error: " + error.message);
  }
}
