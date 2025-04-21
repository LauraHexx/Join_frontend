/*ADD NEW CONTACT*************************************************************************/

/**
 * Retrieves data for a new contact, including generating an ID, random color,
 * name, initials, email, and phone number.
 */
async function getDataNewContact() {
  let newContact = {
    color: getRandomColor(),
    name: addContactName.value,
    email: addContactEmail.value,
    phone_number: addContactPhone.value,
  };
  checkNewContactData(newContact);
}

/**
 * Checks if the email of a new contact is already existing. Displays an error message
 * if the email is already taken, otherwise adds the new contact.
 * @param {Object} newContact - The new contact object to be checked and added.
 */
function checkNewContactData(newContact) {
  const foundExistingEmail = findExistingEmail(CONTACTS, addContactEmail.value);
  const foundExistingName = findExistingUsernameInContacts(
    CONTACTS,
    addContactName.value
  );
  if (foundExistingName) {
    showError("errorEnterANewName");
    hideError("errorEnterANewEmail");
  } else if (foundExistingEmail) {
    showError("errorEnterANewEmail");
    hideError("errorEnterANewName");
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
  CONTACTS.push(newContact);
  let payload = {};
  payload = newContact;
  await addContact(payload);
  await initContacts();
  showAnimationNewContactSuccess();
}

/**
 * Closes the add contact display by canceling the add process, hiding the display,
 * and adjusting the UI accordingly.
 */
function closeAddContact() {
  cancelAddContact();
  hideDisplay("contentAddDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  hideAlleAddContactErrors();
}

/**
 * Hides all error messages related to adding a contact.
 */
function hideAlleAddContactErrors() {
  hideError("errorEnterANewName");
  hideError("errorEnterANewEmail");
}

/**
 * Cancels the process of adding a new contact by clearing the input fields and errors.
 */
function cancelAddContact() {
  document.getElementById("addContactName").value = "";
  document.getElementById("addContactEmail").value = "";
  document.getElementById("addContactPhone").value = "";
  document.getElementById("errorEnterANewEmail").classList.add("d-none");
}

/**
 * Shows a success animation after successfully adding a new contact.
 * @async
 */
async function showAnimationNewContactSuccess() {
  if (bigScreen()) {
    await toggleClass("contactCreatedSucess", "d-none");
    await playAnimation("contactCreatedSucess", "animation-moveUpAndShake");
    setTimeout(() => {
      toggleClass("contactCreatedSucess", "animation-moveUpAndShake");
      toggleClass("contactCreatedSucess", "d-none");
    }, 2000);
  }
}
