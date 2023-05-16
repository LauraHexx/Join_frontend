let SELECTED_USER = "";
let CONTACTS = [];
let FIRST_INITIALS_NO_DUPLICAT = [];

async function initContacts() {
  await loadUserData();
  await getLoggedUser();
  await init("contacts");
  checkAndSortContacts();
}

async function checkAndSortContacts() {
  CONTACTS = LOGGED_USER.contacts;
  if (CONTACTS) {
    sortContactsAlphabetically();
    await renderFirstInitialsList();
    renderContacts();
  }
}

function sortContactsAlphabetically() {
  CONTACTS.sort((a, b) => a.name.localeCompare(b.name));
}

async function renderFirstInitialsList() {
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    if (!FIRST_INITIALS_NO_DUPLICAT.includes(firstInitial)) {
      FIRST_INITIALS_NO_DUPLICAT.push(firstInitial);
      document.getElementById("contactList").innerHTML +=
        renderFirstInitialsListHtml(firstInitial);
    }
  });
}

function renderFirstInitialsListHtml(firstInitial) {
  return /*html*/ `
      <div class="oneSection">
        <span id="letterCategory">${firstInitial}</span>
         <div class="partingLineGrey"></div>
         <div id="contactsLetter${firstInitial}"></div>
      </div>
  `;
}

function renderContacts() {
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    document.getElementById(`contactsLetter${firstInitial}`).innerHTML +=
      renderContactsHtml(contact);
  });
}

function renderContactsHtml(contact) {
  return /*html*/ `
     <div
        onclick="openContactDetails(${contact.id})"
        class="singleContact">
        <div style="background-color: ${contact.color}" class="initialsOfNames smallCircle">${contact.initials}</div>
        <div id="deatilsOfUSer">
          <span>${contact.name}</span>
          <br />
          <a href="mailto:${contact.email}"
          onclick="event.stopPropagation();"
          >${contact.email}</a
          >
        </div>
      </div>
    `;
}
