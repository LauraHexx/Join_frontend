/**
 * Starts the sign-up process.
 */
function signUp() {
  hideAllErrors();
  PAYLOAD = getSignUpData();
  checkIfPasswordsMatch();
}

/**
 * Hides all error messages.
 */
function hideAllErrors() {
  hideError("userNameIsAlreadyRegistered");
  hideError("emailIsAlreadyRegistered");
  hideError("passwordsDoNotMatch");
}

/**
 * Retrieves and returns the sign-up data from the form.
 * @returns {Object} The sign-up data object.
 */
function getSignUpData() {
  return {
    username: signUpName.value.trim(),
    email: signUpEmail.value.trim(),
    password: signUpPassword.value.trim(),
    repeated_password: signUpPasswordConfirmation.value.trim(),
  };
}

/**
 * Checks if the entered passwords match and triggers registration.
 */
function checkIfPasswordsMatch() {
  if (PAYLOAD.password !== PAYLOAD.repeated_password) {
    showError("passwordsDoNotMatch");
  } else {
    register();
  }
}

/**
 * Stores the registration response data in local storage.
 * @param {Object} responseData - The data returned from the registration request.
 */
function setLocalStorage(responseData) {
  setItemInLocalStorage("loggedUserToken", responseData.token);
  setItemInLocalStorage("loggedUserId", responseData.id);
  setItemInLocalStorage("loggedUserName", responseData.username);
  setItemInLocalStorage("loggedUserEmail", responseData.email);
}

/**
 * Handles registration errors by checking the error message and displaying the appropriate error message to the user.
 * @param {Object} error - The error object containing the error message.
 * @param {string} error.message - The error message received during registration.
 */
function handleRegistrationErrors(error) {
  if (userNameAlreadyExists(error.message)) {
    showError("userNameIsAlreadyRegistered");
  } else if (emailAlreadyExists(error.message)) {
    showError("emailIsAlreadyRegistered");
  }
}

/**
 * Checks if the error message indicates that the username is already taken.
 * @param {string} error - The error message to check.
 * @returns {boolean} - Returns true if the error message indicates that the username already exists, otherwise false.
 */
function userNameAlreadyExists(error) {
  return error.includes("A user with that username already exists");
}

/**
 * Checks if the error message indicates that the email is already registered.
 * @param {string} error - The error message to check.
 * @returns {boolean} - Returns true if the error message indicates that the email is already registered, otherwise false.
 */
function emailAlreadyExists(error) {
  return error.includes("EMAIL_ALREADY_REGISTERED");
}
