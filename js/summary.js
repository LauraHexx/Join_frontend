let AMOUNT_TASKS_IN_BOARD;
let AMOUNT_TASKS_TO_DO;
let AMOUNT_TASKS_IN_PROGRESS;
let AMOUNT_TASKS_AWAITING_FEEDBACK;
let AMOUNT_TASKS_DONE;
let AMOUNT_TASKS_URGENT;
let NEXT_DUE_DATE;

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
  setSummary();
}

function greeting() {
  setGreetingForTimeOfDay();
  greetUser();
}

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

function setSummary() {
  TASKS = LOGGED_USER.tasks;
  AMOUNT_TASKS_IN_BOARD = TASKS.length;
  AMOUNT_TASKS_TO_DO = countTasksInProcessStep("todo");
  AMOUNT_TASKS_IN_PROGRESS = countTasksInProcessStep("inProgress");
  AMOUNT_TASKS_AWAITING_FEEDBACK = countTasksInProcessStep("awaitingFeedback");
  AMOUNT_TASKS_DONE = countTasksInProcessStep("done");
  AMOUNT_TASKS_URGENT = countTasksUrgentPrio();
  NEXT_DUE_DATE = getNextDueDate();
  renderSummary();
}

function renderSummary() {
  document.getElementById("tasksInBoard").innerHTML = AMOUNT_TASKS_IN_BOARD;
  document.getElementById("tasksInProgress").innerHTML =
    AMOUNT_TASKS_IN_PROGRESS;
  document.getElementById("tasksAwaitingFeedback").innerHTML =
    AMOUNT_TASKS_AWAITING_FEEDBACK;
  document.getElementById("tasksUrgent").innerHTML = AMOUNT_TASKS_URGENT;
  document.getElementById("tasksUrgent").innerHTML = AMOUNT_TASKS_URGENT;
  document.getElementById("upcomingDeadline").innerHTML = NEXT_DUE_DATE;
}

function countTasksInProcessStep(processStep) {
  let count = 0;
  TASKS.forEach((task) => {
    if (task.processStep === processStep) {
      count++;
    }
  });
  return count;
}

function countTasksUrgentPrio() {
  let count = 0;
  TASKS.forEach((task) => {
    if (task.priority === "urgent") {
      count++;
    }
  });
  return count;
}

function getNextDueDate() {
  const dueDates = TASKS.map((task) => new Date(task.dueDate));
  dueDates.sort((a, b) => a - b);
  const maxDueDate = dueDates[dueDates.length - 1];
  const today = new Date();
  if (maxDueDate >= today) {
    const month = months[maxDueDate.getMonth()];
    const day = maxDueDate.getDate();
    const year = maxDueDate.getFullYear();
    return `${month} ${day}, ${year}`;
  } else {
    return "none";
  }
}
