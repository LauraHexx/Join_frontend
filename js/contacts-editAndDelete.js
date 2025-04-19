/*EDIT CONTACT***********************************************************************************/

let PAYLOAD = {};

/**
 * Renders the edit contact display.
 */
function renderEditContact() {
  showDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  document.getElementById("contentEditDisplay").innerHTML =
    renderEditContactHtml();
}

/**
 * Retrieves data from input fields to create an edited contact object.
 * @returns {object} The edited contact object with name, email, and phone properties.
 */
function getDataEditContact() {
  hideAllErrors();
  let editedContact = {
    name: editContactName.value,
    email: editContactEmail.value,
    phone: editContactPhone.value,
  };
  checkEditContactData(editedContact);
}

/**
 * Hides all error messages related to contact name and email validation.
 */
function hideAllErrors() {
  hideError("errorNameIsAlreadyTaken");
  hideError("errorEmailIsAlreadyTaken");
}

/**
 * Validates the edited contact data by checking for duplicate name or email.
 * If duplicates are found, shows corresponding error messages.
 * Otherwise, proceeds to save the changes.
 * @param {Object} editedContact - The contact data being edited (not directly used in this function).
 */
function checkEditContactData(editedContact) {
  const filteredContacts = filterContacts();
  const foundExistingEmail = findExistingEmail(
    filteredContacts,
    editContactEmail.value
  );
  const foundExistingName = findExistingUsername(
    filteredContacts,
    editContactName.value
  );

  showErrorOrSaveEdits(foundExistingEmail, foundExistingName);
}

/**
 * Displays appropriate error messages if name or email already exist.
 * If no duplicates are found, saves the edited contact.
 * @param {boolean} foundExistingEmail - Indicates whether the email already exists.
 * @param {boolean} foundExistingName - Indicates whether the name already exists.
 */
function showErrorOrSaveEdits(foundExistingEmail, foundExistingName) {
  if (foundExistingName) {
    showError("errorNameIsAlreadyTaken");
  } else if (foundExistingEmail) {
    showError("errorEmailIsAlreadyTaken");
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
 * Saves the edits made to the contact.
 * @async
 */
async function saveEdits() {
  closeDetailInfos();
  hideDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  changeData();
  setPayload();
  await changeContact(SELECTED_CONTACT.id, "PUT", PAYLOAD);
  await loadDataAndRenderContacts();
}

/**
 * Changes the data of the selected contact based on the edits made.
 */
function changeData() {
  SELECTED_CONTACT.name = editContactName.value;
  SELECTED_CONTACT.email = editContactEmail.value;
  SELECTED_CONTACT.phone_number = editContactPhone.value;
  SELECTED_CONTACT.initials = getInitials(editContactName.value);
}

/**
 * Prepares the payload for an API request by copying the selected contact's data.
 * Removes the 'id' field from the payload to avoid sending it in the request body.
 */
function setPayload() {
  PAYLOAD = { ...SELECTED_CONTACT };
  delete PAYLOAD.id;
}

/*DELETE CONTACT***********************************************************************************/

/**
 * Deletes the selected contact.
 */
async function deleteContact() {
  hideDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "ovegetDataEditContactrflowHidden");
  closeDetailInfos();
  deleteContactFromContactList();
  await changeContact(SELECTED_CONTACT.id, "DELETE");
  await loadDataAndRenderContacts();
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
