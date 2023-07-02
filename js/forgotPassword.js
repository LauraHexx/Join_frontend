/**
 * Initializes the forgot password process by loading the user Data.
 * Displays a loading image during the loading time.
 * @async
 */
async function initForgotPassword() {
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  toggleClass("loadingContainer", "d-none");
}

/**
 * Checks the email to reset the password.
 * @param {Event} event - The event object.
 */
function checkEmailToResetPassword() {
  event.preventDefault();
  let existingUser = checkForExistingUser("emailForgotPassword");
  if (existingUser) {
    hideError("noUserWithThisEmail");
    saveEmailToResetPassword();
    sendResetEmail();
  } else {
    showError("noUserWithThisEmail");
  }
}

/**
 * Saves the email in the local storage.
 */
function saveEmailToResetPassword() {
  let email = document.querySelector('input[name="recipient"]').value;
  setItemInLocalStorage("emailToResetPassword", email);
}

/**
 * Sends the reset email.
 */
function sendResetEmail() {
  document.querySelector("form").action =
    "http://laura-hesidenz.developerakademie.net/Join/send_mail.php";
  document.querySelector("form").submit();
}
