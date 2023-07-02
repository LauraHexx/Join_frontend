/*EDIT CONTACT***********************************************************************************/

/**
 * Renders the edit contact display.
 */
function renderEditContact() {
  document.getElementById("contentEditDisplay").innerHTML =
    renderEditContactHtml();
  toggleClass("body", "overflowHidden");
  showDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
}

/**
 * Retrieves data from input fields to create an edited contact object.
 * @returns {object} The edited contact object with name, email, and phone properties.
 */
function getDataEditContact() {
  let editedContact = {
    name: editContactName.value,
    email: editContactEmail.value,
    phone: editContactPhone.value,
  };
  checkEditContactData(editedContact);
}

/**
 * Checks if the email of a new contact is already existing in the filtered Contacts (without selected contact).
 * Displays an error message if the email is already taken, otherwise adds the new contact.
 * @param {object} editedContact - The edited contact object.
 */
function checkEditContactData(editedContact) {
  const filteredContacts = filterContacts();
  const foundExistingEmail = findExistingEmail(
    filteredContacts,
    editContactEmail.value
  );
  if (foundExistingEmail) {
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
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
  changeData();
  await setItem("users", JSON.stringify(USERS));
  await loadDataAndRenderContacts();
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
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "ovegetDataEditContactrflowHidden");
  closeDetailInfos();
  deleteContactFromContactList();
  deleteContactFromTasks();
  await setItem("users", JSON.stringify(USERS));
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
