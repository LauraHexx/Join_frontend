async function initSignUp() {
  await loadUserData();
}

function checkSignUpData() {
  const existingUser = checkForExistingUser();
  if (existingUser) {
    showError("userIsAlreadyRegistered");
  } else {
    registerNewUser();
  }
}

function checkForExistingUser() {
  return USERS.find((user) => user.email === signUpEmail.value);
}

async function registerNewUser() {
  pushNewUserToArray();
  await setItem("users", JSON.stringify(USERS));
  loadTemplate("summary.html");
}

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

function getInitials(fullname) {
  const partsOfName = fullname.trim().split(" ");
  let initials = "";
  if (oneName(partsOfName)) {
    initials = getFirstTwoInitials(partsOfName[0]);
  } else {
    initials = getFirstAndLastInitial(partsOfName);
  }
  return initials;
}

function oneName(partsOfName) {
  return partsOfName.length === 1;
}

function getFirstTwoInitials(name) {
  const firstInitial = name[0].toUpperCase();
  const secondInitial = name[1].toUpperCase();
  const initials = firstInitial + secondInitial;
  return initials;
}

function getFirstAndLastInitial(partsOfName) {
  const firstNameInitial = partsOfName[0][0].toUpperCase();
  const lastNameInitial = partsOfName[partsOfName.length - 1][0].toUpperCase();
  const initials = firstNameInitial + lastNameInitial;
  return initials;
}
