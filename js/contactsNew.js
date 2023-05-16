let SELECTED_CONTACT = "";
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
    const indexOfContact = CONTACTS.indexOf(contact);
    document.getElementById(`contactsLetter${firstInitial}`).innerHTML +=
      renderContactsHtml(contact, indexOfContact);
  });
}

function renderContactsHtml(contact, indexOfContact) {
  return /*html*/ `
     <div
        onclick="openContactDetails(${indexOfContact})"
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

async function openContactDetails(indexOfContact) {
  SELECTED_CONTACT = CONTACTS[indexOfContact];
  renderContactDetails();
  await playAnimation("mainInfosContact", "animation-slideInRight");
  setTimeout(() => {
    toggleClass("mainInfosContact", "animation-slideInRight");
  }, 1000);
}

function renderContactDetails() {
  document.getElementById("mainInfosContact").innerHTML = "";
  document.getElementById("mainInfosContact").innerHTML =
    renderContactDetailsHtml();
}

function renderContactDetailsHtml() {
  return /*html*/ `
     <div class="addTaskToContact gap">
       <div class="initialsOfNames bigCircle">${SELECTED_CONTACT.initials}</div>
       <div class="nameAndAddTask">
         <span class="name">${SELECTED_CONTACT.name}</span>
         <a
           onclick="toggleClass('body', 'overflowHidden'); showAddTask('containerAdd','animation-slideInRight','d-none')"
           class="addTask">
           <img
             src="../assets/img/plusBlue.svg"
             alt="image of icon to add a task" />
           <span>Add Task</span>
         </a>
       </div>
     </div>
     <div class="editContact gap">
       <span>Contact Information</span>
       <a
         onclick="renderEditContact()">
         <img
           src="../assets/img/pencilBlue.svg"
           alt="image of icon to edit contact" />
         <span class="editContactSpan">Edit Contact</span>
       </a>
     </div>
     <div class="emailAndPhone gap">
       <div class="email">
         <span class="bold">Email</span>
         <a href="mailto:${SELECTED_CONTACT.email}">${SELECTED_CONTACT.email}</a>
       </div>
       <div class="phone">
         <span class="bold">Phone</span>
         <a href="phone:${SELECTED_CONTACT.phone}">${SELECTED_CONTACT.phone}</a>
       </div>
     </div>
    `;
}
