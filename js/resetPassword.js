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
  checkIfLinkActivated();
}

function checkIfLinkActivated() {
  emailToReset = getItemFromLocalStorage("emailToResetPassword");
  if (emailToReset) {
    checkIfBothPasswordsAreSame();
  }
}

function checkIfBothPasswordsAreSame() {
  let newPassword = newPasswordInput.value;
  let confirmPassword = confirmPasswordInput.value;
  if (newPassword === confirmPassword) {
    changePassword();
  }
}

function changePassword() {
  let userToChangePasswordFor = checkForExistingUser("emailToResetPassword");
  console.log(userToChangePasswordFor);
}
