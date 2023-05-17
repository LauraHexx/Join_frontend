let CONTACTS = [];
let FIRST_INITIALS_NO_DUPLICAT = [];
let SELECTED_CONTACT = "";

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
  let FIRST_INITIALS_NO_DUPLICAT = [];
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
  clearContacts();
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    const indexOfContact = CONTACTS.indexOf(contact);
    document.getElementById(`contactsLetter${firstInitial}`).innerHTML +=
      renderContactsHtml(contact, indexOfContact);
  });
}

function clearContacts() {
  const containers = document.querySelectorAll('[id^="contactsLetter"]');
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i];
    container.innerHTML = "";
  }
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
         <a href="tel:${SELECTED_CONTACT.phone}">${SELECTED_CONTACT.phone}</a>
       </div>
     </div>
    `;
}

function renderEditContact() {
  document.getElementById("contentEditDisplay").innerHTML =
    renderEditContactHtml();
  showDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
}

function renderEditContactHtml() {
  return /*html*/ `
      <div class="displayEditContact">
        <div class="leftSectionEdit">
          <img
          onclick="hideDisplay('contentEditDisplay', 'd-none'); toggleClass('body', 'overflowHidden')"
            class="cursorPointer closeWhite d-none"
            src="../assets/img/closeWhite.svg"
            alt="image of icon to close the editing" />
          <img
            class="logoEdit"
            src="../assets/img/logoWhite.svg"
            alt="logo of join" />
          <h1>Edit contact</h1>
          <div class="blueLine"></div>
        </div>
        <div class="rightSectionEdit">
          <img
            onclick="hideDisplay('contentEditDisplay', 'd-none'); toggleClass('body', 'overflowHidden')"
            class="cursorPointer closeDarkEdit"
            src="../assets/img/closeDark.svg"
            alt="image of icon to close the adding" />
          <div id="editContactInitials" class="bigCircleEdit">${SELECTED_CONTACT.initials}</div>
          <div class="formEdit">
            <input
              value="${SELECTED_CONTACT.name}"
              id="editContactName"
              class="input inputName"
              type="name"
              placeholder="Name"
              required />
            <div class="editContactEmailContainer">
              <input
                value="${SELECTED_CONTACT.email}"
                id="editContactEmail"
                class="input inputEmail"
                type="email"
                placeholder="Email"
                required />
              <span id="errorEmailIsAlreadyTaken" class="d-none">Email already belongs to a contact. Please update it.</span>
            </div>
            <input
              value=${SELECTED_CONTACT.phone}
              id="editContactPhone"
              class="input inputPhone"
              type="number"
              placeholder="Phone"
               />
            <div class="editContactBtns">
              <button onclick="deleteEdits()" class="deleteBtn">Delete</button>
              <button onclick="checkEdits()" class="saveBtn">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
}

function deleteEdits() {
  editContactName.value = SELECTED_CONTACT.name;
  editContactEmail.value = SELECTED_CONTACT.email;
  editContactPhone.value = SELECTED_CONTACT.phone;
  hideError("errorEmailIsAlreadyTaken");
}

function checkEdits() {
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

function filterContacts() {
  return CONTACTS.filter((contact) => contact !== SELECTED_CONTACT);
}

function findExistingEmail(contacts, email) {
  return contacts.find((contact) => contact.email === email);
}

async function saveEdits() {
  let indexContactToEdit = CONTACTS.indexOf(SELECTED_CONTACT);
  let contactToEdit = CONTACTS[indexContactToEdit];
  contactToEdit.name = editContactName.value;
  contactToEdit.email = editContactEmail.value;
  contactToEdit.phone = editContactPhone.value;
  contactToEdit.initials = getInitials(editContactName.value);
  await setItem("users", JSON.stringify(USERS));
  initContacts();
  closeEditContact();
}

function closeEditContact() {
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
}

async function getDataNewContact() {
  let newContact = {
    color: getRandomColor(),
    name: addContactName.value,
    initials: getInitials(addContactName.value),
    email: addContactEmail.value,
    phone: addContactPhone.value,
  };
  checkIfEmailIsAlreadyExisting(newContact);
}

function checkIfEmailIsAlreadyExisting(newContact) {
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

async function addNewContact(newContact) {
  LOGGED_USER.contacts.push(newContact);
  await setItem("users", JSON.stringify(USERS));
  closeAddContact();
  await initContacts();
  /*await toggleClass("contactCreatedSucess", "d-none");*/
  /*await playAnimation("contactCreatedSucess", "animation-slideUpDown");*/
}

function closeAddContact() {
  hideDisplay("contentAddDisplay", "d-none");
  toggleClass("body", "overflowHidden");
}

function cancelNewContact() {
  addContactName.value = "";
  addContactEmail.value = "";
  addContactPhone.value = "";
}
