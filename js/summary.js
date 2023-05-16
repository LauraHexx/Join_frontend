async function initSummary() {
  await loadUserData();
  await getLoggedUser();
  await init("summary");
  changeImageOnHover(
    "pencilLogo",
    "../assets/img/toDosPencilWhite.svg",
    "../assets/img/toDosPencilBlue.svg"
  );
  changeImageOnHover(
    "doneCheck",
    "../assets/img/doneCheckWhite.svg",
    "../assets/img/doneCheckBlue.svg"
  );
  greeting();
}

function greeting() {
  setGreetingForTimeOfDay();
  greetUser();
}

/**
 * Sets the greeting based on the current time of day.
 * @returns {void}
 */
function setGreetingForTimeOfDay() {
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour >= 0 && currentHour < 12) {
    greeting = "Good morning,";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good day,";
  } else {
    greeting = "Good evening,";
  }
  document.getElementById("greetingTimeOfDay").innerHTML = greeting;
}

function greetUser() {
  if (LOGGED_USER === "Guest") {
    document.getElementById("greetedUser").innerHTML = "Guest";
  } else {
    document.getElementById("greetedUser").innerHTML = `${LOGGED_USER.name}`;
  }
}
