/**
 * Initializes the login screen by adjusting UI and loading saved login data.
 */
async function initLogin() {
  changeZindexAnimation();
  getLocalStorage();
}

/**
 * Changes the z-index property after a delay. So it is possible to click on the elements.
 */
function changeZindexAnimation() {
  setTimeout(() => {
    const animationDiv = document.getElementById("animationDiv");
    animationDiv.style.zIndex = 0;
  }, 800);
}

/**
 * Retrieves values from local storage and sets them as the values of the input fields in the login form.
 */
function getLocalStorage() {
  loginEmail.value = getItemFromLocalStorage("email");
  loginPassword.value = getItemFromLocalStorage("password");
}

/**
 * Sends login data to the backend and handles the response.
 * If login is successful, stores user data and handles "remember me".
 * If login fails, displays an error message.
 */
async function checkIfDataCorrect() {
  const loginData = getLoginData();
  try {
    const response = await login(loginData); 
    if (response && response.token) {
      checkIfRememberMeActiv();
      setLocalStorage(response)
      loadTemplate("templates/summary.html");
    } else {
      showError("dataIncorrect");
    }
  } catch (error) {
    showError("dataIncorrect");
  }
}

/**
 * Reads email and password values from input fields.
 * @returns {Object} loginData - Contains email and password
 */
function getLoginData() {
  return {
    email: loginEmail.value,
    password: loginPassword.value
  };
}

/**
 * Checks if the "Remember Me" checkbox is activated and stores the email and password in the local storage if true.
 */
function checkIfRememberMeActiv() {
  if (checkbox.checked) {
    setItemInLocalStorage("email", loginEmail.value);
    setItemInLocalStorage("password", loginPassword.value);
  }
}

/**
 * Logs in as a guest user, stores session data and loads the summary page.
 */
async function setGuestLogin() {
  try {
    const response = await guestLogin(); 
    if (response && response.token) {
      setLocalStorage(response)
      loadTemplate("templates/summary.html");
    }
  } catch (error) {
    console.error("error:", error);
  }
}
