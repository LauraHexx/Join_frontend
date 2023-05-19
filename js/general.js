let USERS = [];

const SAMPLE_DATA_CONTACTS = [
  {
    id: 1,
    color: "#FF0000",
    name: "Max Mustermann",
    email: "max.mustermann@test",
    phone: 0123456789,
    initials: "MM",
  },
  {
    id: 2,
    color: "#00FF00",
    name: "Erika Musterfrau",
    email: "erika.musterfrau@test",
    phone: 0123456788,
    initials: "EM",
  },
  {
    id: 3,
    color: "#0000FF",
    name: "John Doe",
    email: "john.doe@test",
    phone: 0123456799,
    initials: "JD",
  },
  {
    id: 4,
    color: "#FFFF00",
    name: "Johny Depp",
    email: "johny.depp@test",
    phone: 0123456777,
    initials: "JD",
  },
  {
    id: 5,
    color: "#00FFFF",
    name: "Laura Residenz",
    email: "laura.residenz@test",
    phone: 0123456766,
    initials: "LR",
  },
  {
    id: 6,
    color: "#FFA500",
    name: "Hannah Müller",
    email: "hannah.mueller@test",
    phone: 01234566789,
    initials: "HM",
  },
];

const SAMPLE_DATA_CATEGORYS = [
  {
    name: "Developing",
    color: "blue",
  },
  {
    name: "HR",
    color: "red",
  },
  {
    name: "Marketing",
    color: "orange",
  },
  {
    name: "Sales",
    color: "green",
  },
];

let CATEGORYS = [];

let LOGGED_USER = "";

async function init(currentHtmlTemplate) {
  await includeHTML();
  styleCurrentSectionInNav(currentHtmlTemplate);
}

/**
 * Loads HTML Code into elements signed with [w3-include-html]
 * @async
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    await loadHTML(includeElements[i]);
  }
}

/**
 * Adds HTML code from a file to the given element.
 * @async
 * @param {object} _element The HTML element to which code should be added.
 * @param {string} _file The source file name.
 */
async function loadHTML(_element, _file) {
  let file = _file;
  let element = _element;

  if (!file) {
    file = element.getAttribute("w3-include-html");
  } else {
    element = document.getElementById(_element);
  }

  let resp = await fetch(file);
  if (resp.ok) {
    element.innerHTML = await resp.text();
  } else {
    element.innerHTML = "Page not found";
  }
}

/**
 * It is used to check which html template is opened based on the url.
 * It then styles the opened section in the navbar.
 * @param {string} currentHtmlTemplate - Name of html template.
 */
function styleCurrentSectionInNav(currentHtmlTemplate) {
  if (!currentHtmlTemplate) return;
  const path = window.location.pathname;
  if (path.includes(currentHtmlTemplate)) {
    document.getElementById(currentHtmlTemplate).classList.add("activeSection");
  }
}

/**
 * Loads users from storage and parses the JSON data.
 * @async
 * @throws {Error} If an error occurs during loading or parsing of user data.
 * @returns {Promise<void>} A promise that resolves when the users are loaded and parsed successfully.
 */
async function loadUserData() {
  try {
    USERS = JSON.parse(await getItem("users"));
    console.log("USERS SERVER", USERS);
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Loads tasks from storage and parses the JSON data.
 * @async
 * @throws {Error} If an error occurs during loading or parsing of user data.
 * @returns {Promise<void>} A promise that resolves when the users are loaded and parsed successfully.
 */
async function loadTasks() {
  try {
    TASKS = JSON.parse(await getItem("tasks"));
    console.log("TASKS SERVER", TASKS);
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Loads tasks from storage and parses the JSON data.
 * @async
 * @throws {Error} If an error occurs during loading or parsing of user data.
 * @returns {Promise<void>} A promise that resolves when the users are loaded and parsed successfully.
 */
async function loadCategorys() {
  try {
    CATEGORYS = JSON.parse(await getItem("categorys"));
    console.log("CATEGORYS SERVER", CATEGORYS);
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Stores the id of the user in the local storage for greeting in summary.
 *  @param {number} userId - The id of the user who will be greeted.
 */
function setDataForGreeting(userId) {
  setItemInLocalStorage("loggedUserId", userId);
}

/**
 * Toggles the specified class of the specified element ID. If the element has the
 * class, it will be removed. If it does not have the class, it will be added.
 * @param {string} elementId - The ID of the element to toggle the class for
 * @param {string} className - The class to toggle
 */
function toggleClass(elementId, className) {
  let element = document.getElementById(elementId);
  element.classList.toggle(className);
}

/**
 * This function toggles the "blur" filter on certain elements.
 * The elements to be filtered are selected using their CSS selectors.
 * Here, "nav", "header", and "#content" are selected.
 * If the element already has the "filterBlur" class, it is removed. Otherwise, the class is added
 */
function toggleBlurFilter() {
  const elements = document.querySelectorAll("nav, header, #content");
  elements.forEach((element) => {
    if (element.classList.contains("filterBlur")) {
      element.classList.remove("filterBlur");
    } else {
      element.classList.add("filterBlur");
    }
  });
}

/**
 * Plays a CSS animation on an element with the given ID.
 * @param {string} id - The ID of the element on which the animation will be played.
 * @param {string} animationClass - The CSS class of the animation to apply to the element.
 */
function playAnimation(id, animationClass) {
  let element = document.getElementById(id);
  element.classList.add(animationClass);
}

/**
 * Changes the image displayed when hovering over a specific HTML element or its parent div.
 * @param {string} elementId - The ID of the image element to apply the function to.
 * @param {string} imgSrcOnHover - The file path of the image to display when hovering over the element or its parent div.
 * @param {string} imgSrcOnMouseOut - The file path of the image to display when the mouse leaves the element or its parent div.
 */
function changeImageOnHover(elementId, imgSrcOnHover, imgSrcOnMouseOut) {
  const element = document.getElementById(elementId);
  const parent = element.parentElement;
  element.addEventListener("mouseover", () => {
    element.src = imgSrcOnHover;
  });
  element.addEventListener("mouseout", () => {
    element.src = imgSrcOnMouseOut;
  });
  parent.addEventListener("mouseover", () => {
    element.src = imgSrcOnHover;
  });
  parent.addEventListener("mouseout", () => {
    element.src = imgSrcOnMouseOut;
  });
}

/**
 * Loads a template by updating the window location.
 * @param {string} template - The URL of the template to be loaded.
 * @returns {void}
 */
function loadTemplate(template) {
  window.location = template;
}

/**
 * Sets an item in the local storage.
 * @param {string} key - The key under which the item will be stored.
 * @param {any} value - The value to be stored.
 * Note: The value will be converted to a JSON string before storing it in the local storage.
 */
function setItemInLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves an item from the local storage.
 * @param {string} key - The key of the item to retrieve.
 * @returns {any} The retrieved value.
 * Note: The value will be parsed from JSON before being returned.
 */
function getItemFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * Removes an item from the local storage.
 * @param {string} key - The key of the item to remove.
 */
function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key);
}

/***************************DISPLAYS******************************/

function showDisplay(id, animationClass, className) {
  toggleClass(id, className);
  playAnimation(id, animationClass);
  toggleBlurFilter();
}

function hideDisplay(id, className) {
  toggleClass(id, className);
  toggleBlurFilter();
}

/**
 * Toggles the specified class of the given element ID. If the element has the class, it is removed.
 * If it doesn't have the class, it is added.
 * @param {string} elementId - The ID of the element to toggle the class for.
 * @param {string} className - The class to toggle.
 */
function toggleClass(elementId, className) {
  let element = document.getElementById(elementId);
  element.classList.toggle(className);
}

function getUserData(userId) {
  let user = USERS.find((user) => user.id === userId);
  return user;
}

function getDataLoggedUser() {
  let loggedUserId = getItemFromLocalStorage("loggedUserId");
  if (loggedUserId === "Guest") {
    LOGGED_USER.name = "Guest";
  } else {
    LOGGED_USER = getUserData(loggedUserId);
  }
}

async function getLoggedUser() {
  const loggedUserId = getItemFromLocalStorage("loggedUserId");
  if (!loggedUserId) {
    loadTemplate("../index.html");
  } else {
    LOGGED_USER = getUserData(loggedUserId);
    console.log("LOGGED_USER:", LOGGED_USER);
  }
}

async function logOut() {
  removeItemFromLocalStorage("loggedUserId");
  loadTemplate("../index.html");
}

function hideError(id) {
  const errorElement = document.getElementById(id);
  if (!errorElement.classList.contains("d-none")) {
    errorElement.classList.add("d-none");
  }
}

/**
 * Checks if a value is undefined and removes the "d-none" class from an element with the ID "error" + the variable name if it is.
 *
 * @param {string} id - The name of the variable to check.
 */
function showError(id) {
  const errorElement = document.getElementById(id);
  errorElement.classList.remove("d-none");
}

async function sortCategorysAlphabetically() {
  CATEGORYS = CATEGORYS.sort((a, b) => a.name.localeCompare(b.name));
}

function getUserId() {
  const id = USERS.length + 1;
  return id;
}

/**
 * Generates a random hex code.
 * @returns {string} A random hex code.
 */
function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function getInitials(fullname) {
  if (fullname) {
    const partsOfName = fullname.trim().split(" ");
    let initials = "";
    if (oneName(partsOfName)) {
      initials = getFirstTwoInitials(partsOfName[0]);
    } else {
      initials = getFirstAndLastInitial(partsOfName);
    }
    return initials;
  }
}

function oneName(partsOfName) {
  return partsOfName.length === 1;
}

function getFirstTwoInitials(name) {
  const firstInitial = name[0].toUpperCase();
  const secondInitial = name[1].toUpperCase();
  const initials = firstInitial + secondInitial;
  return initials;
}

function getFirstAndLastInitial(partsOfName) {
  const firstNameInitial = partsOfName[0][0].toUpperCase();
  const lastNameInitial = partsOfName[partsOfName.length - 1][0].toUpperCase();
  const initials = firstNameInitial + lastNameInitial;
  return initials;
}
