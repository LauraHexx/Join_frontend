let AMOUNT_TASKS_IN_BOARD;
let AMOUNT_TASKS_TO_DO;
let AMOUNT_TASKS_IN_PROGRESS;
let AMOUNT_TASKS_AWAITING_FEEDBACK;
let AMOUNT_TASKS_DONE;
let AMOUNT_TASKS_URGENT;
let NEXT_DUE_DATE;

async function initSummary() {
  toggleClass("loadingContainer", "d-none");
  setDashboard()
  setEventListener();
  toggleClass("loadingContainer", "d-none");
}

function setDashboard() {
  await loadUserData();
  await getLoggedUser();
  await init("summary");
  await setSummaryData();
  await renderSummary();
  greeting();
}

/**
 * Sets event listeners for image elements to change their source on hover.
 */
function setEventListener() {
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

/*GREETING*********************************************************************/

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
 * Sets the greeting element with the specified greeting.
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
  const greetedUser = document.getElementById("greetedUser");
  if (LOGGED_USER === "Guest") {
    greetedUser.innerHTML = "Guest";
  } else {
    greetedUser.innerHTML = LOGGED_USER.name;
  }
}

/*DATA SUMMARY****************************************************************/

/**
 * Sets the summary data by updating various task-related information.
 */
function setSummaryData() {
  setTasksOfLoggedUser();
  countTasks();
  determineDeadline();
}

/**
 * Sets the global variable TASKS with the logged user's tasks.
 */
function setTasksOfLoggedUser() {
  TASKS = LOGGED_USER.tasks;
}

/**
 * Sets variables with the amount of the tasks in the specified process step
 */
function countTasks() {
  AMOUNT_TASKS_IN_BOARD = TASKS.length;
  AMOUNT_TASKS_TO_DO = countTasksInProcessStep("todo");
  AMOUNT_TASKS_IN_PROGRESS = countTasksInProcessStep("inProgress");
  AMOUNT_TASKS_AWAITING_FEEDBACK = countTasksInProcessStep("awaitingFeedback");
  AMOUNT_TASKS_DONE = countTasksInProcessStep("done");
  AMOUNT_TASKS_URGENT = countTasksUrgentPrio();
}

/**
 * Counts the tasks in the specified process step.
 * @param {string} processStep - The process step to count tasks for.
 * @returns {number} The number of tasks in the specified process step.
 */
function countTasksInProcessStep(processStep) {
  let count = 0;
  TASKS.forEach((task) => {
    if (task.processStep === processStep) {
      count++;
    }
  });
  return count;
}

/**
 * Counts the tasks with urgent priority.
 * @returns {number} The number of tasks with urgent priority.
 */
function countTasksUrgentPrio() {
  let count = 0;
  TASKS.forEach((task) => {
    if (task.priority === "urgent") {
      count++;
    }
  });
  return count;
}

/**
 * Sets variable with the next deadline for a task.
 * @returns {string} The formatted due date or "none" if there is no upcoming due date.
 */
function determineDeadline() {
  NEXT_DUE_DATE = getNextDueDate();
}

/**
 * Sets the next due date from the list of tasks.
 * @returns {string} The formatted due date or "none" if there is no upcoming due date.
 */
function getNextDueDate() {
  const dueDates = getDueDates();
  const maxDueDate = getMaxDueDate(dueDates);
  const today = getToday();

  if (maxDueDate >= today) {
    return formatDueDate(maxDueDate);
  } else {
    return "none";
  }
}

/**
 * Sets the due dates for all tasks.
 * @returns {Array} An array of Date objects representing the due dates.
 */
function getDueDates() {
  return TASKS.map((task) => new Date(task.dueDate));
}

/**
 * Finds the maximum due date from the given array of due dates.
 * @param {Array} dueDates - An array of Date objects representing the due dates.
 * @returns {Date} The maximum due date.
 */
function getMaxDueDate(dueDates) {
  dueDates.sort((a, b) => a - b);
  return dueDates[dueDates.length - 1];
}

/**
 * Sets today's date with the time set to 00:00:00.
 * @returns {Date} Today's date with the time set to 00:00:00.
 */
function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Formats the given date into a string representation.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDueDate(date) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

/**
 * Renders the data in the summary on the webpage.
 */
async function renderSummary() {
  document.getElementById("tasksInBoard").innerHTML = AMOUNT_TASKS_IN_BOARD;
  document.getElementById("tasksInProgress").innerHTML =
    AMOUNT_TASKS_IN_PROGRESS;
  document.getElementById("tasksAwaitingFeedback").innerHTML =
    AMOUNT_TASKS_AWAITING_FEEDBACK;
  document.getElementById("tasksUrgent").innerHTML = AMOUNT_TASKS_URGENT;
  document.getElementById("upcomingDeadline").innerHTML = NEXT_DUE_DATE;
  document.getElementById("tasksToDo").innerHTML = AMOUNT_TASKS_TO_DO;
  document.getElementById("tasksDone").innerHTML = AMOUNT_TASKS_DONE;
}
