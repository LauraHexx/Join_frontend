let FIRST_INITIALS_NO_DUPLICAT = [];
let SELECTED_CONTACT = "";

/**
 * Initializes the contacts by loading data, set EventListeners and Rendering Html.
 * Displays a loading image during the loading time.
 * @async
 */
async function initContacts() {
  await init("contacts");
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  await getLoggedUser();
  renderContactList();
  setContactsAndCategorysDropDownMenu();
  setEventScreenSize();
  setEventCloseDropDown();
  setEventListenerHoverBtn();
}

/*CONTACT DETAILS***********************************************************************************/

/**
 * Opens the contact details for the given index.
 * @param {number} indexOfContact - The index of the contact to open.
 */
async function openContactDetails(indexOfContact) {
  if (!bigScreen()) {
    styleContactDetailsMobile();
  }
  if (animationIsNotPlaying()) {
    SELECTED_CONTACT = CONTACTS[indexOfContact];
    playAnimationContactDetails();
    renderContactDetails();
  }
}

/**
 * Styles the contact details for mobile view.
 */
function styleContactDetailsMobile() {
  document.getElementById("contactDetails").style.display = "flex";
  document.getElementById("contactList").style.display = "none";
}

/**
 * Checks if the contact details animation is not currently playing.
 * @returns {boolean} True if the animation is not playing, false otherwise.
 */
function animationIsNotPlaying() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  return !mainInfosContact.classList.contains("animation-slideInRight");
}

/**
 * Plays the animation for the contact details.
 * @async
 */
async function playAnimationContactDetails() {
  await playAnimation("mainInfosContact", "animation-slideInRight");
  setTimeout(() => {
    document
      .getElementById("mainInfosContact")
      .classList.remove("animation-slideInRight");
  }, 1000);
}

/**
 * Renders the contact details.
 */
function renderContactDetails() {
  document.getElementById("mainInfosContact").innerHTML = "";
  document.getElementById("mainInfosContact").innerHTML =
    renderContactDetailsHtml();
}

/**
 * Closes the detail information of the contact.
 */
function closeDetailInfos() {
  let detailInfos = document.getElementById("mainInfosContact");
  detailInfos.innerHTML = "";
}

/*EDIT CONTACT***********************************************************************************/

/**
 * Renders the edit contact display.
 */
function renderEditContact() {
  document.getElementById("contentEditDisplay").innerHTML =
    renderEditContactHtml();
  showDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
}

function getDataFromInputEditContact() {
  let editedContact = {
    name: getDataFromInput("editContactName", "errorNoName"),
    email: getDataFromInput("editContactEmail", "errorNoEmail"),
    phone: getDataFromInput("editContactPhone", "errorNoNumber"),
  };
  checkDataEdited(editedContact);
}

function checkDataEdited(editedContact) {
  if (requiredDataEditedContactComplete(editedContact)) {
    checkFilteredContactsforExistingEmail(editedContact);
  }
}

function requiredDataEditedContactComplete(editedContact) {
  return (
    editedContact.name !== undefined &&
    editedContact.email !== undefined &&
    editedContact.phone !== undefined
  );
}

/**
 * Checks if email edits are not possible because the email is already taken.
 * Displays an error message if the email is already existing, otherwise saves the edits.
 */
function checkFilteredContactsforExistingEmail() {
  const filteredContacts = filterContacts();
  const foundExistingEmail = findExistingEmail(
    filteredContacts,
    editContactEmail.value
  );
  if (foundExistingEmail) {
    showError("errorEmailIsAlreadyTaken");
    hideError("errorNoEmail");
  } else {
    saveEdits();
  }
}

/**
 * Filters the contacts to exclude the selected contact.
 * @returns {Array} The filtered contacts array.
 */
function filterContacts() {
  return CONTACTS.filter((contact) => contact !== SELECTED_CONTACT);
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
 * Saves the edits made to the contact.
 * @async
 */
async function saveEdits() {
  changeData();
  await setItem("users", JSON.stringify(USERS));
  initContacts();
  closeDetailInfos();
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
}

/**
 * Changes the data of the selected contact based on the edits made.
 */
function changeData() {
  SELECTED_CONTACT.name = editContactName.value;
  SELECTED_CONTACT.email = editContactEmail.value;
  SELECTED_CONTACT.phone = editContactPhone.value;
  SELECTED_CONTACT.initials = getInitials(editContactName.value);
}

/*DELETE CONTACT***********************************************************************************/

/**
 * Deletes the selected contact.
 */
async function deleteContact() {
  deleteContactFromContactList();
  deleteContactFromTasks();
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
  closeDetailInfos();
  await setItem("users", JSON.stringify(USERS));
  await initContacts();
  playAnimationContactDeletedSuccess();
}

/**
 * Deletes the contact from contacts of logged user.
 */
function deleteContactFromContactList() {
  const indexSelectedContact = CONTACTS.indexOf(SELECTED_CONTACT);
  CONTACTS.splice(indexSelectedContact, 1);
}

/**
 * Deletes the contact from every tasks.
 */
function deleteContactFromTasks() {
  const idSelectedContact = SELECTED_CONTACT.id;
  const tasksToEdit = LOGGED_USER.tasks;
  tasksToEdit.forEach((task) => {
    const indexContactToDelete = task.contacts.indexOf(idSelectedContact);
    if (indexContactToDelete) {
      task.contacts.splice(indexContactToDelete, 1);
    }
  });
}

/**
 * Plays the animation for successful contact deletion.
 * @async
 */
async function playAnimationContactDeletedSuccess() {
  await toggleClass("contactDeletedSucess", "d-none");
  await playAnimation("contactDeletedSucess", "animation-moveUpAndShake");
  setTimeout(() => {
    toggleClass("contactDeletedSucess", "animation-moveUpAndShake");
    toggleClass("contactDeletedSucess", "d-none");
  }, 2000);
}

/*ADD NEW CONTACT***********************************************************************************/

/**
 * Retrieves data for a new contact, including generating an ID, random color,
 * name, initials, email, and phone number.
 */
async function getDataFromInputNewContact() {
  let newContact = {
    id: getContactId(),
    color: getRandomColor(),
    name: getDataFromInput("addContactName", "errorEnterName"),
    initials: getInitials(addContactName.value),
    email: getDataFromInput("addContactEmail", "errorEnterAEmail"),
    phone: getDataFromInput("addContactPhone", "errorEnterAnNumber"),
  };
  checkDataNewContact(newContact);
}

/**
 * Gets the next available contact ID by finding the highest ID among existing contacts
 * and incrementing it by 1.
 * @returns {number} The next available contact ID.
 */
function getContactId() {
  let highestId = 0;
  CONTACTS.forEach((contact) => {
    if (contact.id > highestId) {
      highestId = contact.id;
    }
  });
  return highestId + 1;
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
 * Checks if the required data for a new contact is complete and performs additional checks.
 * @param {Object} newContact - The object representing the new contact.
 */
function checkDataNewContact(newContact) {
  if (requiredDataNewContactComplete(newContact)) {
    checkIfEmailIsAlreadyExisting(newContact);
  }
}

/**
 * Checks if the required data for a new contact is complete.
 * @param {Object} newContact - The object representing the new contact.
 * @returns {boolean} - Returns true if all required data is present, otherwise false.
 */
function requiredDataNewContactComplete(newContact) {
  return (
    newContact.name !== undefined &&
    newContact.email !== undefined &&
    newContact.phone !== undefined
  );
}

/**
 * Checks if the email of a new contact is already existing. Displays an error message
 * if the email is already taken, otherwise adds the new contact.
 * @param {Object} newContact - The new contact object to be checked and added.
 */
function checkIfEmailIsAlreadyExisting(newContact) {
  const foundExistingEmail = findExistingEmail(
    LOGGED_USER.contacts,
    addContactEmail.value
  );
  if (foundExistingEmail) {
    showError("errorEnterANewEmail");
    hideError("errorEnterName");
  } else {
    addNewContact(newContact);
  }
}

/**
 * Adds a new contact to the list of contacts for the logged-in user. Performs necessary
 * cleanup and UI updates after adding the contact.
 * @param {Object} newContact - The new contact object to be added.
 * @async
 */
async function addNewContact(newContact) {
  LOGGED_USER.contacts.push(newContact);
  cancelAddContact();
  closeAddContact();
  hideError("errorEnterANewEmail");
  await setItem("users", JSON.stringify(USERS));
  await initContacts();
  showAnimationNewContactSuccess();
}

/**
 * Cancels the process of adding a new contact by clearing the input fields and errors.
 */
function cancelAddContact() {
  document.getElementById("addContactName").innerHTML = "";
  document.getElementById("addContactEmail").innerHTML = "";
  document.getElementById("addContactPhone").innerHTML = "";
  document.getElementById("errorEnterName").classList.add("d-none");
  document.getElementById("errorEnterAEmail").classList.add("d-none");
  document.getElementById("errorEnterAnNumber").classList.add("d-none");
  document.getElementById("errorEnterANewEmail").classList.add("d-none");
}

/**
 * Closes the add contact display by canceling the add process, hiding the display,
 * and adjusting the UI accordingly.
 */
function closeAddContact() {
  cancelAddContact();
  hideDisplay("contentAddDisplay", "d-none");
  toggleClass("body", "overflowHidden");
}

/**
 * Shows a success animation after successfully adding a new contact.
 * @async
 */
async function showAnimationNewContactSuccess() {
  await toggleClass("contactCreatedSucess", "d-none");
  await playAnimation("contactCreatedSucess", "animation-moveUpAndShake");
  setTimeout(() => {
    toggleClass("contactCreatedSucess", "animation-moveUpAndShake");
    toggleClass("contactCreatedSucess", "d-none");
  }, 2000);
}

/*EVENT LISTENER - SCREEN SIZE******************************************************************/

/**
 * Sets an event listener to monitor the screen size changes.
 */
function setEventScreenSize() {
  window.addEventListener("resize", monitorScreenSize);
}

/**
 * Monitors the screen size changes and adjusts the display of contact list and details accordingly.
 */
function monitorScreenSize() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  if (bigScreen()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "flex";
  } else if (!mainInfosAreKlicked(mainInfosContact)) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  } else if (mainInfosAreKlicked() && contactListStyleIsFlex()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  }
}

/**
 * Checks if the mainInfosContact is clicked by checking if its innerHTML is not empty.
 * @returns {boolean} A boolean indicating whether the mainInfosContact is clicked.
 */
function mainInfosAreKlicked() {
  return mainInfosContact.innerHTML.trim() !== "";
}

/**
 * Checks if the contact list style is set to flex.
 * @returns {boolean} A boolean indicating whether the contact list style is set to flex.
 */
function contactListStyleIsFlex() {
  return document.getElementById("contactList").style.display === "flex";
}

/**
 * Displays the contact list and hides the contact details when clickig "back" button.
 */
function showContactList() {
  document.getElementById("contactList").style.display = "flex";
  document.getElementById("contactDetails").style.display = "none";
}
