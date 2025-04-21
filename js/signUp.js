let PAYLOAD = {};

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
async function checkIfPasswordsMatch() {
  if (PAYLOAD.password !== PAYLOAD.repeated_password) {
    showError("passwordsDoNotMatch");
  } else {
    await register(PAYLOAD);
  }
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
  return error.includes("UNIQUE constraint failed: auth_user.username");
}

/**
 * Checks if the error message indicates that the email is already registered.
 * @param {string} error - The error message to check.
 * @returns {boolean} - Returns true if the error message indicates that the email is already registered, otherwise false.
 */
function emailAlreadyExists(error) {
  return error.includes("EMAIL_ALREADY_REGISTERED");
}
