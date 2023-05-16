async function initSignUp() {
  await loadUsers();
}

function checkSignUpData() {
  const existingUser = checkForExistingUser();
  if (existingUser) {
    showError("userIsAlreadyRegistered");
  } else {
    registerNewUser();
  }
}

/**
 * Checks if the user's email matches any user in the `users` array.
 * @returns {Object|undefined} The user object if login data is correct, otherwise undefined.
 */
function checkForExistingUser() {
  return USERS.find((user) => user.email === signUpEmail.value);
}

/**
 * Registers a new user with the provided name, email, and password.
 * The user information is added to the 'users' array.
 * The 'users' array is stored in the storage as a JSON string.
 * Resets the new user form after successful registration.
 * Loads the summary after registration.
 */
async function registerNewUser() {
  pushNewUserToArray();
  await setItem("users", JSON.stringify(USERS));
  loadTemplate("summary.html");
}

function pushNewUserToArray() {
  const newUser = {
    color: getRandomColor(),
    id: getUserId(),
    name: signUpName.value,
    email: signUpEmail.value,
    password: signUpPassword.value,
    tasks: [],
    contacts: [],
  };
  USERS.push(newUser);
  setDataForGreeting(newUser.id);
}

/**
 * Generates a random hex code.
 * @returns {string} A random hex code.
 */
function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Get initials from a name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials of the name.
 */
function getInitials() {
  const fullname = signUpName.value.trim().split(" ");
  let initials = "";
  if (oneName(fullname)) {
    initials = getFirstInitial(fullname[0]);
  } else {
    initials = getFirstAndLastInitial(fullname);
  }
  return initials;
}

function oneName(fullname) {
  return fullname.length === 1;
}

/**
 * Get initials for a single name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials of the name.
 */
function getFirstInitial(fullname) {
  const initial = name[0].toUpperCase();
  return initial;
}

/**
 * Get initials from a full name.
 * @param {string[]} names - An array of names [firstName, lastName].
 * @returns {string} The initials of the full name.
 */
function getFirstAndLastInitial(fullname) {
  const firstNameInitial = fullname[0][0].toUpperCase();
  const lastNameInitial = fullname[fullname.length - 1][0].toUpperCase();
  const initials = firstNameInitial + lastNameInitial;
  return initials;
}
