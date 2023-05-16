async function initLogin() {
  changeZindexAnimation();
  getLocalStorage();
  await loadUserData();
}

/**
 * Changes the z-index property after a delay. So it is possible to click on the elements.
 */
function changeZindexAnimation() {
  setTimeout(() => {
    const animationDiv = document.getElementById("animationDiv");
    animationDiv.style.zIndex = 0;
  }, 1500);
}

/**
 * Retrieves values from local storage and sets them as the values of the input fields in the login form.
 * @returns {void}
 */
function getLocalStorage() {
  loginEmail.value = getItemFromLocalStorage("email");
  loginPassword.value = getItemFromLocalStorage("password");
}

/**
 * Checks if the data provided by the user is correct.
 * If the login data is correct, it checks if "Remember Me" is activated
 * and loads the summary template. Otherwise, it calls the `wrongData` function.
 */
function checkIfDataCorrect() {
  const correctUserData = lookForUserData();
  if (correctUserData) {
    checkIfRememberMeActiv();
    setItemInLocalStorage("loggedUserId", correctUserData.id);
    loadTemplate("templates/summary.html");
  } else {
    wrongData();
  }
}

/**
 * Checks if the user's email and password match any user in the `users` array.
 * @returns {Object|undefined} The user object if login data is correct, otherwise undefined.
 */
function lookForUserData() {
  return USERS.find(
    (user) =>
      user.email === loginEmail.value && user.password === loginPassword.value
  );
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
 * Displays an error message indicating that the provided data is incorrect.
 */
function wrongData() {
  const dataIncorrect = document
    .getElementById("dataIncorrect")
    .classList.remove("d-none");
}

async function guestLogin() {
  const newGuestUser = {
    color: getRandomColor(),
    id: getUserId(),
    name: "Guest",
    initials: "GU",
    tasks: [],
    contacts: SAMPLE_DATA_CONTACTS,
  };
  USERS.push(newGuestUser);
  await setItem("users", JSON.stringify(USERS));
  setDataForGreeting(newGuestUser.id);
  loadTemplate("templates/summary.html");
}
