let SELECTED_USER = "";
let CONTACTS = [];
let FIRST_INITIALS_NO_DUPLICAT = [];

async function initContacts() {
  await loadUserData();
  await getLoggedUser();
  await init("contacts");
  checkAndSortContacts();
}

function checkAndSortContacts() {
  let CONTACTS = LOGGED_USER.contacts;
  if (CONTACTS) {
    CONTACTS.sort((a, b) => a.name.localeCompare(b.name));
  }
}

async function renderFirstInitialsList() {
  USERS.forEach((user) => {
    const initials = 
    const firstInitial = user.initials.charAt(0);
    if (!FIRST_INITIALS_NO_DUPLICAT.includes(firstInitial)) {
      FIRST_INITIALS_NO_DUPLICAT.push(firstInitial);
      document.getElementById("contactList").innerHTML +=
        renderFirstInitialsListHtml(firstInitial);
    }
  });
}
