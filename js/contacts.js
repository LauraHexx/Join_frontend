let FIRST_INITIALS_NO_DUPLICAT = [];
let SELECTED_CONTACT = "";

async function initContacts() {
  await init("contacts");
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  await getLoggedUser();
  renderContactList();
  setContactsAndCategorysDropDownMenu();
  setEventScreenSize();
  setEventCloseDropDown();
  setEventListenerHoverBtn();
}

function renderContactList() {
  CONTACTS = LOGGED_USER.contacts;
  if (CONTACTS) {
    sortArrayAlphabetically(CONTACTS);
    renderFirstInitialsList();
    renderContactsInInitialList();
  }
}

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

function clearContacts() {
  const containers = document.querySelectorAll('[id^="contactsLetter"]');
  containers.forEach((container) => {
    container.innerHTML = "";
  });
}

async function openContactDetails(indexOfContact) {
  if (!bigScreen()) {
    styleContactDetailsMobile();
  }
  if (animationIsNotPlaying()) {
    SELECTED_CONTACT = CONTACTS[indexOfContact];
    playAnimationContactDetails();
    renderContactDetails();
  }
}

function styleContactDetailsMobile() {
  document.getElementById("contactDetails").style.display = "flex";
  document.getElementById("contactList").style.display = "none";
}

function animationIsNotPlaying() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  return !mainInfosContact.classList.contains("animation-slideInRight");
}

async function playAnimationContactDetails() {
  if (window.innerWidth > 920) {
    await playAnimation("mainInfosContact", "animation-slideInRight");
    setTimeout(() => {
      toggleClass("mainInfosContact", "animation-slideInRight");
    }, 1000);
  }
}

function renderContactDetails() {
  document.getElementById("mainInfosContact").innerHTML = "";
  document.getElementById("mainInfosContact").innerHTML =
    renderContactDetailsHtml();
}

function renderEditContact() {
  document.getElementById("contentEditDisplay").innerHTML =
    renderEditContactHtml();
  showDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
}

async function deleteContact() {
  const indexSelectedContact = CONTACTS.indexOf(SELECTED_CONTACT);
  CONTACTS.splice(indexSelectedContact, 1);
  const idSelectedContact = SELECTED_CONTACT.id;
  deleteContactFromTasks(idSelectedContact);
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
  closeDetailInfos();
  await setItem("users", JSON.stringify(USERS));
  await initContacts();
  playAnimationContactDeletedSuccess();
}

function deleteContactFromTasks(idSelectedContact) {
  const tasksToEdit = LOGGED_USER.tasks;
  tasksToEdit.forEach((task) => {
    const indexContactToDelete = task.contacts.indexOf(idSelectedContact);
    if (indexContactToDelete) {
      task.contacts.splice(indexContactToDelete, 1);
    }
  });
}

async function playAnimationContactDeletedSuccess() {
  await toggleClass("contactDeletedSucess", "d-none");
  await playAnimation("contactDeletedSucess", "animation-moveUpAndShake");
  setTimeout(() => {
    toggleClass("contactDeletedSucess", "animation-moveUpAndShake");
    toggleClass("contactDeletedSucess", "d-none");
  }, 2000);
}

function closeDetailInfos() {
  let detailInfos = document.getElementById("mainInfosContact");
  detailInfos.innerHTML = "";
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
  closeDetailInfos();
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
  changeData();
  await setItem("users", JSON.stringify(USERS));
  initContacts();
}

function changeData() {
  SELECTED_CONTACT.name = editContactName.value;
  SELECTED_CONTACT.email = editContactEmail.value;
  SELECTED_CONTACT.phone = editContactPhone.value;
  SELECTED_CONTACT.initials = getInitials(editContactName.value);
}

async function getDataNewContact() {
  let newContact = {
    id: getContactId(),
    color: getRandomColor(),
    name: addContactName.value,
    initials: getInitials(addContactName.value),
    email: addContactEmail.value,
    phone: addContactPhone.value,
  };
  checkIfEmailIsAlreadyExisting(newContact);
}

function getContactId() {
  let highestId = 0;
  CONTACTS.forEach((contact) => {
    if (contact.id > highestId) {
      highestId = contact.id;
    }
  });
  return highestId + 1;
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
  cancelAddContact();
  closeAddContact();
  hideError("errorEnterANewEmail");
  await setItem("users", JSON.stringify(USERS));
  await initContacts();
  showAnimationNewContactSuccess();
}

function cancelAddContact() {
  addContactName.value = "";
  addContactEmail.value = "";
  addContactPhone.value = "";
}

function closeAddContact() {
  cancelAddContact();
  hideDisplay("contentAddDisplay", "d-none");
  toggleClass("body", "overflowHidden");
}

async function showAnimationNewContactSuccess() {
  await toggleClass("contactCreatedSucess", "d-none");
  await playAnimation("contactCreatedSucess", "animation-moveUpAndShake");
  setTimeout(() => {
    toggleClass("contactCreatedSucess", "animation-moveUpAndShake");
    toggleClass("contactCreatedSucess", "d-none");
  }, 2000);
}

function showContactList() {
  document.getElementById("contactList").style.display = "flex";
  document.getElementById("contactDetails").style.display = "none";
}

/*EVENT LISTENER************************************/

function setEventScreenSize() {
  window.addEventListener("resize", monitorScreenSize);
}

function monitorScreenSize() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  if (bigScreen()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "flex";
  } else if (!mainInfosAreKlicked(mainInfosContact)) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  } else if (mainInfosAreKlicked() && contactListStyleIsFlex()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  }
}

function bigScreen() {
  return window.innerWidth > 920;
}

function mainInfosAreKlicked() {
  return mainInfosContact.innerHTML.trim() !== "";
}

function contactListStyleIsFlex() {
  return document.getElementById("contactList").style.display === "flex";
}
