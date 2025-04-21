/*EDIT CONTACT***********************************************************************************/

let PAYLOAD = {};
let SELECTED_CONTACT_EMAIL_BEFORE_CHANGE;

/**
 * Renders the edit contact display.
 */
function renderEditContact() {
  showDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  SELECTED_CONTACT_EMAIL_BEFORE_CHANGE = SELECTED_CONTACT.email;
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
  checkEditContactDataContact(editedContact);
}

/**
 * Hides all error messages related to contact name, username and email validation.
 */
function hideAllErrors() {
  hideError("errorNameIsAlreadyTaken");
  hideError("errorEmailIsAlreadyTaken");
  hideError("errorUserNameIsAlreadyTaken");
}

/**
 * Validates the edited contact data by checking for duplicate name or email.
 * If duplicates are found, shows corresponding error messages.
 * Otherwise, proceeds to save the changes.
 * @param {Object} editedContact - The contact data being edited (not directly used in this function).
 */
function checkEditContactDataContact(editedContact) {
  const filteredContacts = filterContacts();
  const foundExistingEmail = findExistingEmail(
    filteredContacts,
    editContactEmail.value
  );
  const foundExistingName = findExistingUsernameInContacts(
    filteredContacts,
    editContactName.value
  );
  showErrorIfContactIsAlreadyExisting(
    foundExistingEmail,
    foundExistingName,
    editedContact
  );
}

/**
 * Filters the contacts to exclude the selected contact.
 * @returns {Array} The filtered contacts array.
 */
function filterContacts() {
  return CONTACTS.filter((contact) => contact !== SELECTED_CONTACT);
}

/**
 * Displays an error message if a contact with the same name or email already exists.
 * If no duplicates are found, proceeds with further validation for the edited contact.
 * @param {boolean} foundExistingEmail - Indicates if the email is already used by another contact.
 * @param {boolean} foundExistingName - Indicates if the name is already used by another contact.
 * @param {Object} editedContact - The contact object being edited.
 */
function showErrorIfContactIsAlreadyExisting(
  foundExistingEmail,
  foundExistingName,
  editedContact
) {
  if (foundExistingName) {
    showError("errorNameIsAlreadyTaken");
  } else if (foundExistingEmail) {
    showError("errorEmailIsAlreadyTaken");
  } else {
    checkEditContactDataUserContact(editedContact);
  }
}

/**
 * Validates the edited contact if it is the logged-in user's contact.
 * Checks if the new username is already taken by another user.
 * If not, continues with email validation or directly saves the changes.
 * @param {Object} editedContact - The contact object being edited.
 */
async function checkEditContactDataUserContact(editedContact) {
  if (SELECTED_CONTACT_EMAIL_BEFORE_CHANGE == LOGGED_USER.email) {
    await getUsers();
    const existingUsername = findExistingUsernameInUsers(editedContact.name);
    if (!existingUsername) {
      checkUserEmail(editedContact);
    } else if (existingUsername.username !== SELECTED_CONTACT.name) {
      showError("errorUserNameIsAlreadyTaken");
    } else {
      saveEdits(editedContact);
    }
  } else {
    await saveEdits(editedContact);
  }
}

/**
 * Validates the email of the edited contact if it belongs to the logged-in user.
 * Updates local storage with the new user data before saving.
 * @param {Object} editedContact - The contact object being edited.
 */
async function checkUserEmail(editedContact) {
  console.log("checkUserEmail");
  if (SELECTED_CONTACT_EMAIL_BEFORE_CHANGE == LOGGED_USER.email) {
    updateLocalStorage(editedContact);
    await saveEdits(editedContact);
  }
}

/**
 * Updates the local storage with the name and email of the currently selected contact.
 */
function updateLocalStorage(editedContact) {
  setItemInLocalStorage("loggedUserName", editedContact.name);
  setItemInLocalStorage("loggedUserEmail", editedContact.email);
}

/**
 * Saves the edits made to the contact.
 * @async
 */
async function saveEdits(editedContact) {
  closeDetailInfos();
  hideDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  changeData();
  setPayload();
  updateSelectedContact();
}

function setPayload() {
  PAYLOAD = { ...SELECTED_CONTACT };
  delete PAYLOAD.id;
}

async function updateSelectedContact() {
  console.log("PAYLOAD", PAYLOAD);
  await changeContact(SELECTED_CONTACT.id, "PUT", PAYLOAD);
  await initContacts();
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

/*DELETE CONTACT***********************************************************************************/

/**
 * Deletes the selected contact.
 */
async function deleteContact() {
  hideDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  closeDetailInfos();
  deleteContactFromContactList();
  await changeContact(SELECTED_CONTACT.id, "DELETE");
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
