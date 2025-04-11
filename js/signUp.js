let PAYLOAD;

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
  hideError("userIsAlreadyRegistered");
  hideError("passwordsDoNotMatch");
}

/**
 * Retrieves and returns the sign-up data from the form.
 * @returns {Object} The sign-up data object.
 */
function getSignUpData() {
  return {
    username: signUpName.value.trim().replace(/\s+/g, ""),
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
 * Registers the user by sending the sign-up data to the server.
 * If successful, the user is redirected to the 'summary.html' page.
 * If there is an error, an appropriate error message is displayed.
 * @returns {Promise<void>}
 */
async function register() {
  try {
    const response = await sendRequestWithoutToken(URL_REGISTRATION, PAYLOAD);
    const responseData = await response.json();

    if (response.ok) {
      setLocalStorage(responseData);
      loadTemplate("summary.html");
      load;
    } else {
      handleRegistrationErrors(responseData);
    }
  } catch (error) {
    console.error("Registration error:", error);
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
 * Handles errors that occur during registration.
 * @param {Object} responseData - The error response data.
 */
function handleRegistrationErrors(responseData) {
  console.log("Registration error response:", responseData);
  switch (true) {
    case responseData.hasOwnProperty("username"):
      showError("userIsAlreadyRegistered");

      break;
    case responseData.hasOwnProperty("email"):
      showError("emailIsAlreadyRegistered");
      break;
  }
}
