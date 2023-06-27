/**
 * Renders the contact list.
 */
function renderContactList() {
  CONTACTS = LOGGED_USER.contacts;
  if (CONTACTS) {
    sortArrayAlphabetically(CONTACTS);
    renderFirstInitialsList();
    renderContactsInInitialList();
  }
}

/**
 * Renders the first initials list without duplicates.
 * @async
 */
async function renderFirstInitialsList() {
  FIRST_INITIALS_NO_DUPLICAT = [];
  document.getElementById("contactList").innerHTML = "";
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    if (!FIRST_INITIALS_NO_DUPLICAT.includes(firstInitial)) {
      FIRST_INITIALS_NO_DUPLICAT.push(firstInitial);
      document.getElementById("contactList").innerHTML +=
        renderFirstInitialsListHtml(firstInitial);
    }
  });
}

/**
 * Renders the contacts in the initial list.
 */
function renderContactsInInitialList() {
  clearContacts();
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    const indexOfContact = CONTACTS.indexOf(contact);
    document.getElementById(`contactsLetter${firstInitial}`).innerHTML +=
      renderContactsInInitialListHtml(contact, indexOfContact);
  });
  toggleClass("loadingContainer", "d-none");
}

/**
 * Clears the contacts from the first initials list.
 */
function clearContacts() {
  const containers = document.querySelectorAll('[id^="contactsLetter"]');
  containers.forEach((container) => {
    container.innerHTML = "";
  });
}
