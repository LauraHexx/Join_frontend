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

function saveEmailToResetPassword() {
  event.preventDefault(); // Verhindert das automatische Absenden des Formulars
  let email = document.querySelector('input[name="recipient"]').value;
  let existingUser = checkForExistingUser("emailForgotPassword");
  if (existingUser) {
    hideError("noUserWithThisEmail");
    document.querySelector("form").action =
      "http://laura-hesidenz.developerakademie.net/send_mail.php";
    document.querySelector("form").submit();
  } else {
    showError("noUserWithThisEmail");
  }
}
