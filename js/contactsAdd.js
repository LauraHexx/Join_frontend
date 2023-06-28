/*ADD NEW CONTACT*************************************************************************/

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
  closeAddContact();
  LOGGED_USER.contacts.push(newContact);
  await loadDataAndRender();
  showAnimationNewContactSuccess();
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
 * Cancels the process of adding a new contact by clearing the input fields and errors.
 */
function cancelAddContact() {
  document.getElementById("addContactName").value = "";
  document.getElementById("addContactEmail").value = "";
  document.getElementById("addContactPhone").value = "";
  document.getElementById("errorEnterName").classList.add("d-none");
  document.getElementById("errorEnterAEmail").classList.add("d-none");
  document.getElementById("errorEnterAnNumber").classList.add("d-none");
  document.getElementById("errorEnterANewEmail").classList.add("d-none");
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
