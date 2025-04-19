let SUMMARY = [];

/**
 * Sets the navigation and header for the summary page, loads data, and renders the summary.
 * Displays a loading image during the loading process.
 * @async
 */
async function initSummary() {
  checkIfUserIsLogged();
  await setNavAndHeader("summary");
  await loadDataAndRenderSummary();
  setEventsSummary();
}

/*SUMMARY**********************************************************************************************************/

/**
 * Loads user data, renders the summary, and initializes the greeting for the user.
 * Displays a loading image during the loading process.
 * @async
 */
async function loadDataAndRenderSummary() {
  toggleClass("loadingContainer", "d-none");
  await getSummary();
  renderSummary();
  greeting();
  toggleClass("loadingContainer", "d-none");
}

/**
 * Renders the data in the summary on the webpage.
 * @async
 */
async function renderSummary() {
  document.getElementById("tasksInBoard").innerHTML = SUMMARY.tasks_in_board;
  document.getElementById("tasksInProgress").innerHTML =
    SUMMARY.tasks_in_progress;
  document.getElementById("tasksAwaitingFeedback").innerHTML =
    SUMMARY.tasks_awaiting_feedback;
  document.getElementById("tasksUrgent").innerHTML = SUMMARY.tasks_urgent;
  document.getElementById("upcomingDeadline").innerHTML =
    SUMMARY.upcoming_deadline;
  document.getElementById("tasksToDo").innerHTML = SUMMARY.tasks_todo;
  document.getElementById("tasksDone").innerHTML = SUMMARY.tasks_done;
}

/*GREETING**********************************************************************************************************/

/**
 * Sets the greeting for the time of day and greets the user.
 */
function greeting() {
  setGreetingForTimeOfDay();
  greetUser();
}

/**
 * Sets the greeting based on the current time of day.
 * @returns {string} The generated greeting.
 */
function setGreetingForTimeOfDay() {
  const currentHour = getCurrentHour();
  const greeting = getGreeting(currentHour);
  setGreetingElement(greeting);
  return greeting;
}

/**
 * Determines the appropriate greeting based on the hour.
 * @param {number} hour - The current hour.
 * @returns {string} The greeting message.
 */
function getGreeting(hour) {
  if (isMorning(hour)) {
    return "Good morning,";
  } else if (isMidday(hour)) {
    return "Good day,";
  } else {
    return "Good evening,";
  }
}

/**
 * Retrieves the current hour.
 * @returns {number} The current hour.
 */
function getCurrentHour() {
  return new Date().getHours();
}

/**
 * Checks if the current hour corresponds to the morning.
 * @param {number} currentHour - The current hour.
 * @returns {boolean} True if it's morning, false otherwise.
 */
function isMorning(currentHour) {
  return currentHour >= 0 && currentHour < 12;
}

/**
 * Checks if the current hour corresponds to midday.
 * @param {number} currentHour - The current hour.
 * @returns {boolean} True if it's midday, false otherwise.
 */
function isMidday(currentHour) {
  return currentHour >= 12 && currentHour < 18;
}

/**
 * Sets the greeting element with the specified html greeting.
 * @param {string} greeting - The greeting message to be set.
 */
function setGreetingElement(greeting) {
  const greetingElement = document.getElementById("greetingTimeOfDay");
  greetingElement.innerHTML = greeting;
}

/**
 * Greets the user by displaying their name or "Guest" if not registered.
 */
function greetUser() {
  greetedUser.innerHTML = LOGGED_USER.name;
}

/*EVENT**********************************************************************************************************/

/**
 * Sets event listeners for image elements to change their source on hover.
 */
function setEventsSummary() {
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
}
