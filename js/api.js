/**
 * Sends login request with given credentials.
 * @param {Object} payload - User login data.
 * @returns {Promise<Object>} Server response.
 */
async function login(payload) {
  try {
    const response = await sendRequest("POST", URL_LOGIN, payload);
    return response;
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Logs in as guest user.
 * @returns {Promise<Object>} Server response.
 */
async function guestLogin(payload) {
  try {
    const response = await sendRequest("POST", URL_GUEST_LOGIN);
    return response;
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Sends registration request and stores new user locally.
 * @param {Object} payload - Registration data.
 */
async function register(payload) {
  try {
    const newUser = await sendRequest("POST", URL_REGISTRATION, payload);
    await setLocalStorage(newUser);
    loadTemplate("summary.html");
  } catch (error) {
    handleRegistrationErrors(error);
  }
}

/**
 * Fetches summary data from the server.
 */
async function getSummary() {
  try {
    SUMMARY = await sendRequest("GET", URL_SUMMARY);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Fetches task list from the server.
 */
async function getTasks() {
  try {
    TASKS = await sendRequest("GET", URL_TASKS);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Adds a new task to the server.
 * @param {Object} payload - Task data.
 */
async function addTask(payload) {
  try {
    TASKS = await sendRequest("POST", URL_TASKS, payload);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Modifies an existing task on the server.
 * @param {number} id - Task ID.
 * @param {string} methode - HTTP method (e.g. "PUT", "PATCH", "DELETE").
 * @param {Object} payload - Task update data.
 */
async function changeTask(id, methode, payload) {
  try {
    const method = methode.toUpperCase();
    const url = `${URL_TASKS}${id}/`;
    await sendRequest(method, url, payload);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Fetches all categories from the server.
 */
async function getCategories() {
  try {
    CATEGORYS = await sendRequest("GET", URL_CATEGORIES);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Adds a new category to the server.
 * @param {Object} payload - Category data.
 */
async function addCategorie(payload) {
  try {
    CATEGORYS = await sendRequest("POST", URL_CATEGORIES, payload);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Fetches all contacts from the server and checks guest.
 */
async function getContacts() {
  try {
    CONTACTS = await sendRequest("GET", URL_CONTACTS);
    checkIfGuest();
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Adds a new contact to the server.
 * @param {Object} payload - Contact data.
 */
async function addContact(payload) {
  try {
    CONTACTS = await sendRequest("POST", URL_CONTACTS, payload);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Modifies an existing contact on the server.
 * @param {number} id - Contact ID.
 * @param {string} methode - HTTP method (e.g. "PUT", "PATCH", "DELETE").
 * @param {Object} payload - Contact update data.
 */
async function changeContact(id, methode, payload) {
  try {
    const method = methode.toUpperCase();
    const url = `${URL_CONTACTS}${id}/`;
    await sendRequest(method, url, payload);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Fetches all users from the server.
 */
async function getUsers() {
  try {
    USERS = await sendRequest("GET", URL_USERS);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Sends logout request to the server.
 */
async function logOut() {
  try {
    await sendRequest("POST", URL_LOGOUT);
  } catch (error) {
    console.error("error:", error);
  }
}
