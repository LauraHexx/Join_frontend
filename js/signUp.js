async function initSignUp() {
  await loadUsers();
}

function checkSignUpData() {
  const existingUser = checkForExistingUser();
  const existingName = checkForExistingName();
  if (existingUser) {
    showError("userIsAlreadyRegistered");
  } else if (existingName) {
    showError("nameIsAlreadyTaken");
    hideError("userIsAlreadyRegistered");
  } else {
    registerNewUser();
  }

  /*
  if (existingUser) {
    showError("userIsAlreadyRegistered");
    hideError("nameIsAlreadyTaken");
    return;
  }
  if (existingName) {
    hideError("userIsAlreadyRegistered");
    showError("nameIsAlreadyTaken");
    return;
  }
  if (!existingName && !existingName) {
    registerNewUser();
  }
  */
}

/**
 * Checks if the user's email matches any user in the `users` array.
 * @returns {Object|undefined} The user object if login data is correct, otherwise undefined.
 */
function checkForExistingUser() {
  return USERS.find((user) => user.email === signUpEmail.value);
}

/**
 * Checks if the user's email matches any user in the `users` array.
 * @returns {Object|undefined} The user object if login data is correct, otherwise undefined.
 */
function checkForExistingName() {
  return USERS.find((user) => user.name === signUpName.value);
}

/**
 * Registers a new user with the provided name, email, and password.
 * The user information is added to the 'users' array.
 * The 'users' array is stored in the storage as a JSON string.
 * Resets the new user form after successful registration.
 * Loads the summary after registration.
 */
async function registerNewUser() {
  setDataForGreeting(determineId());
  formatAndPushData();
  await setItem("users", JSON.stringify(USERS));
  loadTemplate("summary.html");
}

function formatAndPushData() {
  const name = signUpName.value;
  const formattedName = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const email = signUpEmail.value;
  const formattedEmail = email.toLowerCase();
  pushDataToArray(formattedName, formattedEmail);
}

function pushDataToArray(formattedName, formattedEmail) {
  USERS.push({
    color: getRandomColor(),
    id: determineId(),
    name: formattedName,
    email: formattedEmail,
    password: signUpPassword.value,
    phone: 049,
    initials: getInitials(),
  });
}

/**
 * Generates a random hex code.
 * @returns {string} A random hex code.
 */
function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function determineId() {
  const id = USERS.length + 1;
  return id;
}

/**
 * Get initials from a name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials of the name.
 */
function getInitials() {
  const names = signUpName.value.trim().split(" ");
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

/**
 * Get initials for a single name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials of the name.
 */
function getInitialsForSingleName(name) {
  const initials = name[0].toUpperCase();
  return initials;
}

function moreThanOneName(names) {
  return names.length > 1;
}

/**
 * Get initials from a full name.
 * @param {string[]} names - An array of names [firstName, lastName].
 * @returns {string} The initials of the full name.
 */
function getInitialsForFullName(names) {
  const firstNameInitial = names[0][0].toUpperCase();
  const lastNameInitial = names[names.length - 1][0].toUpperCase();
  const initials = firstNameInitial + lastNameInitial;
  return initials;
}
