/**
 * Initializes the sign-up process by loading the user Data.
 * Displays a loading image during the loading time.
 * @async
 */
async function initSignUp() {
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  toggleClass("loadingContainer", "d-none");
}

/**
 * Checks the sign-up data.
 * If an existing user with the same email address is found, an error message is displayed.
 * Otherwise, a new user is registered.
 */
function checkSignUpData() {
  const existingUser = checkForExistingUser("signUpEmail");
  if (existingUser) {
    showError("userIsAlreadyRegistered");
  } else {
    registerNewUser();
  }
}

/**
 * Registers a new user and loads summary template.
 * @async
 */
async function registerNewUser() {
  pushNewUserToArray();
  await setItem("users", JSON.stringify(USERS));
  loadTemplate("summary.html");
}

/**
 * It creates a new user object with the provided sign-up details and pushes it into the USERS array
 * Sets the user id for the greeting in the summary template.
 */
function pushNewUserToArray() {
  const newUser = {
    color: getRandomColor(),
    id: getUserId(),
    name: signUpName.value,
    initials: getInitials(signUpName.value),
    email: signUpEmail.value,
    password: signUpPassword.value,
    tasks: [],
    contacts: SAMPLE_DATA_CONTACTS,
    categorys: SAMPLE_DATA_CATEGORYS,
  };
  USERS.push(newUser);
  setDataForGreeting(newUser.id);
}
