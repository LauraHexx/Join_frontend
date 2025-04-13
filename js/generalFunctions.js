//IN THIS FILE ARE FUNCTIONS WHICH ARE USED ON DIFFERENT TEMPLATES

/**
 * Loads the html elements and styles the current html element in the nav bar
 * @param {string} currentHtmlTemplate - The current HTML template to mark in the nav.
 * @async
 */
async function setNavAndHeader(currentHtmlTemplate) {
  await includeHTML();
  styleCurrentSectionInNav(currentHtmlTemplate);
}

/*GENERAL************************************************************************************/

/**
 * Styles the current section in the navigation by adding the "activeSection" class to the corresponding HTML element.
 * @param {string} currentHtmlTemplate - The current HTML template.
 */
function styleCurrentSectionInNav(currentHtmlTemplate) {
  if (!currentHtmlTemplate) return;
  const path = window.location.pathname;
  if (path.includes(currentHtmlTemplate)) {
    document.getElementById(currentHtmlTemplate).classList.add("activeSection");
  }
}

/**
 * Toggles a class on an element.
 * @param {string} elementId - The ID of the element.
 * @param {string} className - The class name to toggle.
 */
function toggleClass(elementId, className) {
  let element = document.getElementById(elementId);
  element.classList.toggle(className);
}

/**
 * Toggles the "filterBlur" class on the specified elements nav, header and #content .
 */
function toggleBlurFilter() {
  const elements = document.querySelectorAll("nav, header, #content");
  elements.forEach((element) => {
    element.classList.toggle("filterBlur");
  });
}

/**
 * Plays an animation on an element by adding the specified animation class.
 * @param {string} id - The ID of the element.
 * @param {string} animationClass - The animation class to add.
 */
function playAnimation(id, animationClass) {
  let element = document.getElementById(id);
  element.classList.add(animationClass);
}

/**
 * Delets an animation on an element by removing the specified animation class.
 * @param {string} id - The ID of the element.
 * @param {string} animationClass - The animation class to remove.
 */
function deleteAnimation(id, animationClass) {
  let element = document.getElementById(id);
  if (element.classList.contains(animationClass)) {
    element.classList.remove(animationClass);
  }
}

function bigScreen() {
  return window.innerWidth > 920;
}

/**
 * Changes the image of an element on hover and mouseout events.
 * @param {string} elementId - The ID of the element.
 * @param {string} imgSrcOnHover - The image source on hover.
 * @param {string} imgSrcOnMouseOut - The image source on mouseout.
 */
function changeImageOnHover(elementId, imgSrcOnHover, imgSrcOnMouseOut) {
  const element = document.getElementById(elementId);
  const parent = element.parentElement;
  setEventChangeImageOnHover(element, parent, imgSrcOnHover, imgSrcOnMouseOut);
}

/**
 * Sets event listeners to change the image of an element on hover and mouseout events.
 * @param {HTMLElement} element - The element to add event listeners to.
 * @param {HTMLElement} parent - The parent element for additional mouseover and mouseout events.
 * @param {string} imgSrcOnHover - The image source on hover.
 * @param {string} imgSrcOnMouseOut - The image source on mouseout.
 */
function setEventChangeImageOnHover(
  element,
  parent,
  imgSrcOnHover,
  imgSrcOnMouseOut
) {
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
 * Retrieves data from an HTML element by its ID.
 * @param {string} id - The ID of the HTML element to retrieve data from.
 * @param {string} idError - The ID of the HTML element to display error messages.
 * @returns {string|undefined} - The retrieved data if it is valid, otherwise undefined.
 */
function getDataFromInput(id, idError) {
  const dataToBeChecked = document.getElementById(id).value;
  if (dataToBeChecked) {
    hideError(idError);
    return dataToBeChecked;
  } else {
    showError(idError);
    return undefined;
  }
}

/**
 * Sets event listeners to change images on hover on the add Task display.
 */
function setEventListenerHoverBtn() {
  changeImageOnHover(
    "clearBtnIcon",
    "../assets/img/addTaskCancelBright.svg",
    "../assets/img/addTaskCancelDark.svg"
  );
  changeImageOnHover(
    "clearBtnIcon",
    "../assets/img/addTaskCancelBright.svg",
    "../assets/img/addTaskCancelDark.svg"
  );
}

/**
 * Loads a template by setting the window location.
 * @param {string} template - The template URL to load.
 */
function loadTemplate(template) {
  window.location = template;
}

/**
 * Goes back to the previous page in the browsing history.
 */
function goBackToPreviousPage() {
  window.history.back();
}

/**
 * Logs out the user by removing the "loggedUserId" item from the local storage and loading the index.html template.
 */
async function logOut() {
  removeItemFromLocalStorage("loggedUserId");
  loadTemplate("../index.html");
}

/**
 * Retrieves contact data by ID from the CONTACTS array.
 * @param {string} id - The ID of the contact.
 * @returns {object} - The contact object matching the provided ID.
 */
function getContactData(id) {
  const contact = CONTACTS.find((contact) => contact.id === id);
  return contact;
}

/**
 * Checks if an existing user with the given email address exists.
 * @param {string} id - The email ID to search for in the USERS array.
 * @returns {User|undefined} The existing user if found, or undefined if not.
 */
function checkForExistingUser(id) {
  return USERS.find((user) => user.email === document.getElementById(id).value);
}

/**
 * Finds an existing contact with the specified email.
 * @param {Array} contacts - The contacts array to search in.
 * @param {string} email - The email to search for.
 * @returns {Object} The contact object if an existing email is found, otherwise null.
 */
function findExistingEmail(contacts, email) {
  return contacts.find((contact) => contact.email === email);
}

/**
 * Finds an existing contact with the specified name.
 * @param {Array} contacts - The contacts array to search in.
 * @param {string} name - The name to search for.
 * @returns {Object} The contact object if an existing name is found, otherwise null.
 */
function findExistingUsername(contacts, name) {
  return contacts.find((contact) => contact.name === name);
}

/**
 * Hides an error element by adding the "d-none" class if it is not already hidden.
 * @param {string} id - The ID of the error element.
 */
function hideError(id) {
  const errorElement = document.getElementById(id);
  if (!errorElement.classList.contains("d-none")) {
    errorElement.classList.add("d-none");
  }
}

/**
 * Shows an error element by removing the "d-none" class.
 * @param {string} id - The ID of the error element.
 */
function showError(id) {
  const errorElement = document.getElementById(id);
  errorElement.classList.remove("d-none");
}

/**
 * Generates a random color from a predefined set of colors.
 * @returns {string} A randomly selected color from the predefined set.
 */
function getRandomColor() {
  const colors = [
    "#FC71FF",
    "#29ABE2",
    "#02CF2F",
    "#AF1616",
    "#462F8A",
    "#FFC700",
    "#9327FF",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Sorts an array of objects alphabetically based on the 'name' property.
 * @param {Array} array - The array to be sorted.
 */
function sortArrayAlphabetically(array) {
  array.sort((a, b) => a.name.localeCompare(b.name));
}

/*DISPLAYS************************************************************************************/

/**
 * Shows a display element by applying an animation class and toggling a specified class.
 * If the window width is greater than 920px, an animation is played.
 * @param {string} id - The ID of the display element.
 * @param {string} animationClass - The animation class to be applied.
 * @param {string} className - The class to be toggled.
 */
function showDisplay(id, animationClass, className) {
  if (bigScreen()) {
    playAnimation(id, animationClass);
  }
  toggleClass(id, className);
  toggleBlurFilter();
}

/**
 * Hides a display element by toggling a specified class and removing the blur filter.
 * @param {string} id - The ID of the display element.
 * @param {string} className - The class to be toggled.
 */
function hideDisplay(id, animationClass, className) {
  deleteAnimation(id, animationClass);
  toggleClass(id, className);
  toggleBlurFilter();
}

/*USERS************************************************************************************/

/**
 * Retrieves the logged-in user's data.
 * Gets the logged user ID from local storage and retrieves the corresponding user data.
 * If no logged-in user is found, redirects to the index.html page.
 * @async
 */
async function getLoggedUser() {
  const loggedUserId = getItemFromLocalStorage("loggedUserId");
  if (!loggedUserId) {
    loadTemplate("../index.html");
  } else {
    LOGGED_USER = getUserData(loggedUserId);
    console.log("LOGGED_USER:", LOGGED_USER);
  }
}

/**
 * Checks if the user is logged in by verifying if a valid token exists in localStorage.
 * If no token is found, it redirects the user to the login page.
 * If the token exists, it sets the logged-in user information and stores the token.
 */
function checkIfUserIsLogged() {
  const loggedUserToken = getItemFromLocalStorage("loggedUserToken");
  if (!loggedUserToken) {
    loadTemplate("../index.html");
  } else {
    LOGGED_USER = setLoggedUser(loggedUserToken);
    TOKEN = getItemFromLocalStorage("loggedUserToken");
  }
}

/**
 * Sets the logged-in user's details (ID, name, email) from localStorage.
 * @returns {Object} The logged-in user's details.
 */
function setLoggedUser() {
  return {
    id: getItemFromLocalStorage("loggedUserId"),
    name: getItemFromLocalStorage("loggedUserName"),
    email: getItemFromLocalStorage("loggedUserEmail"),
  };
}

/**
 * Generates and returns a new user ID based on the number of existing users.
 * @returns {number} The generated user ID.
 */
function getUserId() {
  const id = USERS.length + 1;
  return id;
}

/**
 * Retrieves the user data for a given user ID.
 * @param {number} id - The ID of the user.
 * @returns {object} The user object corresponding to the provided ID.
 */
function getUserData(id) {
  const user = USERS.find((user) => user.id === id);
  return user;
}

/**
 * Extracts the initials from a full name.
 * If the full name is provided, it trims and splits it into parts.
 * Determines whether it's a single name or multiple names and generates the initials accordingly.
 * @param {string} fullname - The full name.
 * @returns {string} The initials extracted from the full name.
 */
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

/**
 * Checks if the name has only one part.
 * @param {Array} partsOfName - The parts of the name.
 * @returns {boolean} True if the name has only one part, false otherwise.
 */
function oneName(partsOfName) {
  return partsOfName.length === 1;
}

/**
 * Generates the initials from the first two characters of a name.
 * @param {string} name - The name.
 * @returns {string} The initials extracted from the name.
 */
function getFirstTwoInitials(name) {
  const firstInitial = name[0].toUpperCase();
  const secondInitial = name[1].toUpperCase();
  const initials = firstInitial + secondInitial;
  return initials;
}

/**
 * Generates the initials from the first character of the first name and the first character of the last name.
 * @param {Array} partsOfName - The parts of the name.
 * @returns {string} The initials extracted from the first and last name.
 */
function getFirstAndLastInitial(partsOfName) {
  const firstNameInitial = partsOfName[0][0].toUpperCase();
  const lastNameInitial = partsOfName[partsOfName.length - 1][0].toUpperCase();
  const initials = firstNameInitial + lastNameInitial;
  return initials;
}

/**
 * Sets the data for greeting by storing the logged user ID in local storage.
 * @param {number} userId - The ID of the logged user.
 */
function setDataForGreeting(userId) {
  setItemInLocalStorage("loggedUserId", userId);
}

/*LOCAL STORAGE************************************************************************************/

/**
 * Stores an item in the local storage as a stringified JSON value.
 * @param {string} key - The key for the item.
 * @param {*} value - The value to be stored.
 */
function setItemInLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves an item from the local storage and parses it from JSON.
 * @param {string} key - The key of the item to be retrieved.
 * @returns {*} The retrieved item value.
 */
function getItemFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * Removes an item from the local storage.
 * @param {string} key - The key of the item to be removed.
 */
function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key);
}
