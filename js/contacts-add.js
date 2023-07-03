/*ADD NEW CONTACT*************************************************************************/

/**
 * Retrieves data for a new contact, including generating an ID, random color,
 * name, initials, email, and phone number.
 */
async function getDataNewContact() {
  let newContact = {
    id: getContactId(),
    color: getRandomColor(),
    name: addContactName.value,
    initials: getInitials(addContactName.value),
    email: addContactEmail.value,
    phone: addContactPhone.value,
  };
  checkNewContactData(newContact);
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
 * Checks if the email of a new contact is already existing. Displays an error message
 * if the email is already taken, otherwise adds the new contact.
 * @param {Object} newContact - The new contact object to be checked and added.
 */
function checkNewContactData(newContact) {
  const foundExistingEmail = findExistingEmail(
    LOGGED_USER.contacts,
    addContactEmail.value
  );
  if (foundExistingEmail) {
    showError("errorEnterANewEmail");
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
  await setItem("users", JSON.stringify(USERS));
  await loadDataAndRenderContacts();
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
