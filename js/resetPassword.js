let emailToReset = "";

/**
 * Initializes the forgot password process by loading the user Data.
 * Displays a loading image during the loading time.
 * @async
 */
async function initResetPassword() {
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  toggleClass("loadingContainer", "d-none");
}

/**
 * Checks if the link has been activated.
 */
function checkIfLinkActivated() {
  emailToReset = getItemFromLocalStorage("emailToResetPassword");
  if (emailToReset) {
    checkIfBothPasswordsAreSame();
    hideError("linkExpired");
  } else {
    showError("linkExpired");
    disableButton();
  }
}

/**
 * Checks if both passwords are the same.
 */
function checkIfBothPasswordsAreSame() {
  let newPassword = newPasswordInput.value;
  let confirmPassword = confirmPasswordInput.value;
  if (newPassword === confirmPassword) {
    changePassword(newPassword);
  }
}

/**
 * Changes the password.
 * @param {string} newPassword - The new password.
 */
async function changePassword(newPassword) {
  let userToChangePasswordFor = getUserToChangePassword();
  userToChangePasswordFor.password = newPassword;
  await setItem("users", JSON.stringify(USERS));
  showAnimationNewPasswordSuccess();
}

/**
 * Retrieves the user to change the password for.
 * @param {string} id - The user ID.
 * @returns {Object} - The user to change the password for.
 */
function getUserToChangePassword(id) {
  return USERS.find((user) => user.email === emailToReset);
}

/**
 * Shows a success animation after successfully reseting the password.
 * @async
 */
async function showAnimationNewPasswordSuccess() {
  removeItemFromLocalStorage("emailToResetPassword");
  await toggleClass("passwordResetSucess", "d-none");
  await playAnimation("passwordResetSucess", "animation-moveUpAndShake");
  await setTimeout(() => {
    toggleClass("passwordResetSucess", "animation-moveUpAndShake");
    toggleClass("passwordResetSucess", "d-none");
  }, 2000);
  await setTimeout(() => {
    loadTemplate("../index.html");
  }, 1000);
}

/**
 * Disables the button.
 */
function disableButton() {
  document.getElementById("continueResetPasswordBtn").disabled = true;
  document
    .getElementById("continueResetPasswordBtn")
    .classList.add("disableButton");
}
