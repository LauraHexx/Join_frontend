async function register() {
  try {
    const newUser = await sendRequest("POST", URL_REGISTRATION);
    setLocalStorage(newUser);
    loadTemplate("summary.html");
  } catch (error) {
    handleRegistrationErrors(error);
  }
}

/**
 * Fetches the summary data from the server and stores it in the `SUMMARY` variable.
 * Logs the data to the console and then renders the summary on the webpage.
 * Catches and logs any errors encountered during the fetch process.
 * @async
 */
async function getSummary() {
  try {
    SUMMARY = await sendRequest("GET", URL_SUMMARY);
    renderSummary();
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Fetches the summary data from the server and stores it in the `SUMMARY_DATA` variable.
 * Logs the data to the console and then renders the summary on the webpage.
 * Catches and logs any errors encountered during the fetch process.
 * @async
 */
async function getContacts() {
  try {
    CONTACTS = await sendRequest("GET", URL_CONTACTS);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Sends a POST request to create a new contact and updates the CONTACTS list with the response.
 * Logs any errors to the console if the request fails.
 * @returns {Promise<void>}
 */
async function addContact() {
  try {
    CONTACTS = await sendRequest("POST", URL_CONTACTS);
  } catch (error) {
    console.error("error:", error);
  }
}

/**
 * Sends an HTTP request to update an existing contact using the specified method (e.g., 'PUT' or 'PATCH').
 * Constructs the URL using the contact's ID. Logs any errors to the console if the request fails.
 *
 * @param {number|string} id - The ID of the contact to be updated.
 * @param {string} methode - The HTTP method to use ('PUT' or 'PATCH').
 * @returns {Promise<void>}
 */
async function changeContact(id, methode) {
  try {
    const method = methode.toUpperCase();
    const url = `${URL_CONTACTS}${id}/`;
    await sendRequest(method, url);
  } catch (error) {
    console.error("error:", error);
  }
}
