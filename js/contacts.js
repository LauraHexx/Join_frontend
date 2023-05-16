/*
const FIRST_INITIALS_NO_DUPLICAT = [];
let SELECTED_CONTACT = "";
let CONTACTS = [];

async function initContacts() {
  await checkIfUserLoggedIn();
  await init("contacts");
  await loadUsers();
  await sortUsersAlphabetically();
  await renderFirstInitialsList();
  await renderContacts();
}


async function sortUsersAlphabetically() {
  USERS = USERS.sort((a, b) => a.initials.localeCompare(b.initials));
}

/**
 * Generates and displays the first letters corresponding to the users' names in the contacts list.
 * @async
 * @returns {void}
 */
async function renderFirstInitialsList() {
  USERS.forEach((user) => {
    const firstInitial = user.initials.charAt(0);
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

/**
 * Sorts the users array based on their initials and renders the contacts under the respective first letters(in alphabetical order).
 * @returns {void}
 */
function renderContacts() {
  USERS.forEach((user) => {
    const firstInitial = user.initials.charAt(0);
    document.getElementById(`contactsLetter${firstInitial}`).innerHTML +=
      renderContactsHtml(user);
  });
}

function renderContactsHtml(user) {
  return /*html*/ `
   <div
      onclick="openContactDetails(${user.id})"
      class="singleContact">
      <div style="background-color: ${user.color}" class="initialsOfNames smallCircle">${user.initials}</div>
      <div id="deatilsOfUSer">
        <span>${user.name}</span>
        <br />
        <a href="mailto:${user.email}"
        onclick="event.stopPropagation();"
        >${user.email}</a
        >
      </div>
    </div>
  `;
}

async function openContactDetails(userId) {
  SELECTED_CONTACT = getUserData(userId);
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
     <div class="NameAndAddTask">
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
        <form onsubmit="saveChanges(); return false" class="formEdit">
          <input
            value="${SELECTED_CONTACT.name}"
            id="editContactName"
            class="input inputName"
            type="name"
            placeholder="Name"
            required />
          <input
            value="${SELECTED_CONTACT.email}"
            id="editContactEmail"
            class="input inputEmail"
            type="email"
            placeholder="Email"
            required />
          <input
            value="${SELECTED_CONTACT.phone}"
            id="editContactPhone"
            class="input inputPassword"
            type="number"
            placeholder="Phone"
             />
          <div class="editContactBtns">
            <button onclick="deleteChanges()" type="button" class="deleteBtn">Delete</button>
            <button type="submit" class="saveBtn">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function deleteChanges() {
  editContactName.value = SELECTED_CONTACT.name;
  editContactEmail.value = SELECTED_CONTACT.email;
  editContactPhone.value = SELECTED_CONTACT.phone;
}

async function saveChanges() {
  formatNewData();
  await setItem("users", JSON.stringify(USERS));
  await location.reload();
}

function formatNewData() {
  const name = editContactName.value;
  const formattedName = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const email = editContactEmail.value;
  const formattedEmail = email.toLowerCase();
  const initials = getInitials();
  changeData(formattedName, formattedEmail, initials);
}

function changeData(formattedName, formattedEmail, initials) {
  let indexUserToEdit = USERS.indexOf(SELECTED_CONTACT);
  let userToEdit = USERS[indexUserToEdit];
  userToEdit.name = formattedName;
  userToEdit.email = formattedEmail;
  userToEdit.phone = document.getElementById("editContactPhone").value;
  userToEdit.initials = initials;
}


function getInitials() {
  const names = editContactName.value.trim().split(" ");
  let initials = "";
  if (oneName(names)) {
    initials = getInitialsForSingleName(names[0]);
  } else if (moreThanOneName(names)) {
    initials = getInitialsForFullName(names);
  }
  return initials;
}

function oneName(names) {
  return names.length === 1;
}


function getInitialsForSingleName(name) {
  const initials = name[0].toUpperCase();
  return initials;
}

function moreThanOneName(names) {
  return names.length > 1;
}


function getInitialsForFullName(names) {
  const firstNameInitial = names[0][0].toUpperCase();
  const lastNameInitial = names[names.length - 1][0].toUpperCase();
  const initials = firstNameInitial + lastNameInitial;
  return initials;
}
*/