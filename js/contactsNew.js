let SELECTED_USER = "";

async function initContacts() {
  await loadUserData();
  await getLoggedUser();
  await init("contacts");
  USERS = [];
  await setItem("users", JSON.stringify(USERS));
  /* await renderContacts();*/
}

async function renderContacts() {
  let contacts = LOGGED_USER.contacts;
  contacts.push({
    color: getRandomColor(),
    name: "Max Mustermann",
    email: "max.mustermann@test",
    phone: 123456456,
  });
  await setItem("users", JSON.stringify(USERS));
}
