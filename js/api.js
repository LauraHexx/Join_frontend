async function register(payload) {
  try {
    const newUser = await sendRequest("POST", URL_REGISTRATION, payload);
    await setLocalStorage(newUser);
    loadTemplate("summary.html");
  } catch (error) {
    handleRegistrationErrors(error);
  }
}

async function getSummary() {
  try {
    SUMMARY = await sendRequest("GET", URL_SUMMARY);
  } catch (error) {
    console.error("error:", error);
  }
}

async function getTasks() {
  try {
    TASKS = await sendRequest("GET", URL_TASKS);
    console.log(TASKS);
  } catch (error) {
    console.error("error:", error);
  }
}

async function addTask(payload) {
  try {
    console.log("addTask")
    TASKS = await sendRequest("POST", URL_TASKS, payload);
    console.log(TASKS);
  } catch (error) {
    console.error("error:", error);
  }
}


async function changeTask(id, methode, payload) {
  try {
    const method = methode.toUpperCase();
    const url = `${URL_TASKS}${id}/`;
    await sendRequest(method, url, payload);
  } catch (error) {
    console.error("error:", error);
  }
}


async function getCategories() {
  try {
    CATEGORYS = await sendRequest("GET", URL_CATEGORIES);
    console.log(CATEGORYS);
  } catch (error) {
    console.error("error:", error);
  }
}

async function addCategorie(payload) {
  try {
    CATEGORYS = await sendRequest("POST", URL_CATEGORIES, payload);
    console.log(CATEGORYS);
  } catch (error) {
    console.error("error:", error);
  }
}

async function getContacts() {
  try {
    CONTACTS = await sendRequest("GET", URL_CONTACTS);
  } catch (error) {
    console.error("error:", error);
  }
}

async function addContact(payload) {
  try {
    CONTACTS = await sendRequest("POST", URL_CONTACTS, payload);
  } catch (error) {
    console.error("error:", error);
  }
}

async function changeContact(id, methode, payload) {
  try {
    const method = methode.toUpperCase();
    const url = `${URL_CONTACTS}${id}/`;
    await sendRequest(method, url, payload);
  } catch (error) {
    console.error("error:", error);
  }
}

async function getUsers() {
  try {
    USERS = await sendRequest("GET", URL_USERS);
    console.log(USERS);
  } catch (error) {
    console.error("error:", error);
  }
}

async function logOut() {
  try {
    await sendRequest("POST", URL_LOGOUT);
  } catch (error) {
    console.error("error:", error);
  }
}