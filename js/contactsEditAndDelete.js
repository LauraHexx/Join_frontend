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

/**
 * Retrieves data from input fields to create an edited contact object.
 * @returns {object} The edited contact object with name, email, and phone properties.
 */
function getDataFromInputEditContact() {
  let editedContact = {
    name: getDataFromInput("editContactName", "errorNoName"),
    email: getDataFromInput("editContactEmail", "errorNoEmail"),
    phone: getDataFromInput("editContactPhone", "errorNoNumber"),
  };
  checkDataEditedContact(editedContact);
}

/**
 * Checks if the required data for the edited contact is complete and proceeds to the next step.
 * @param {object} editedContact - The edited contact object.
 */
function checkDataEditedContact(editedContact) {
  if (requiredDataEditedContactComplete(editedContact)) {
    checkFilteredContactsforExistingEmail(editedContact);
  }
}

/**
 * Checks if the required data for the edited contact is complete.
 * @param {Object} editedContact - The object representing the edited contact.
 * @returns {boolean} - Returns true if all required data is present, otherwise false.
 */
function requiredDataEditedContactComplete(editedContact) {
  return (
    editedContact.name !== undefined &&
    editedContact.email !== undefined &&
    editedContact.phone !== undefined
  );
}

/**
 * Checks if the email of a new contact is already existing in the filtered Contacts (without selected contact).
 * Displays an error message if the email is already taken, otherwise adds the new contact.
 * @param {object} editedContact - The edited contact object.
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
