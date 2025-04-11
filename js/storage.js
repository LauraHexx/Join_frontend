const URL_REGISTRATION = "http://127.0.0.1:8000/api/v1/auth/registration/";
const URL_LOGIN = "http://127.0.0.1:8000/api/v1/auth/login/";
const URL_GUEST_LOGIN = "http://127.0.0.1:8000/api/v1/auth/login/";
const URL_LOGOUT = "http://127.0.0.1:8000/api/v1/auth/logout/";

const URL_USERS = "http://127.0.0.1:8000/api/v1/users/";
const URL_TASKS = "http://127.0.0.1:8000/api/v1/tasks/";
const URL_SUBTASKS = "http://127.0.0.1:8000/api/v1/subtasks/";
const URL_CATEGORIES = "http://127.0.0.1:8000/api/v1/categories/";
const URL_CONTACTS = "http://127.0.0.1:8000/api/v1/contacts/";
const URL_SUMMARY = "http://127.0.0.1:8000/api/v1/summary/";

let TOKEN;

/**
 * Sends a GET request to the specified URL with the given token.
 * @param {string} url - The URL to send the GET request to.
 * @param {string} token - The authentication token to authorize the request.
 * @returns {Promise<any>} A Promise that resolves to the parsed JSON data.
 * @throws {Error} Throws an error if the response is not OK.
 * @async
 */
async function getRequest(url) {
  console.log(TOKEN);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${TOKEN}`,
    },
  });
  return handleResponse(response);
}

/**
 * Sends a POST request to the specified URL with the given payload and authentication token.
 * @param {string} url - The URL to send the POST request to.
 * @param {object} payload - The data to be sent in the body of the request.
 * @param {string} token - The authentication token to authorize the request.
 * @returns {Promise<Response>} A Promise that resolves to the response from the server.
 * @async
 */
async function sendRequestWithToken(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${TOKEN}`, // Adds the token in the header for authorization
    },
    body: JSON.stringify(payload),
  });
}

/**
 * Sends a POST request to the specified URL with the given payload without using a token.
 * @param {string} url - The URL to send the POST request to.
 * @param {object} payload - The data to be sent in the body of the request.
 * @returns {Promise<Response>} A Promise that resolves to the response from the server.
 * @async
 */
async function sendRequestWithoutToken(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Only the Content-Type header is set
    },
    body: JSON.stringify(payload),
  });
}

/**
 * Handles the server response by checking if it is OK and parsing the JSON data.
 * @param {Response} response - The response object from the server.
 * @returns {Promise<any>} A Promise that resolves to the parsed JSON data.
 * @throws {Error} Throws an error if the response is not OK.
 * @async
 */
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}
