let SELECTED_TASK = "";
let PROCESS_STEPS = ["todo", "inProgress", "awaitingFeedback", "done"];

/**
 * Sets the navigation and header for the board page, loads data and sets the contacts and categories drop-down menu in the add task display.
 * @async
 */
async function initBoard() {
  checkIfUserIsLogged();
  await setNavAndHeader("board");
  await loadDataAndRenderTasks();
  await getCategories();
  await getContacts();
  setEventsBoard();
  renderDropDownAddTaskDisplay();
}

/**
 * Loads user data and renders the tasks.
 * Displays a loading image during the loading time.
 * @async
 */
async function loadDataAndRenderTasks() {
  toggleClass("loadingContainer", "d-none");
  await getTasks();
  await renderTasks();
  toggleClass("loadingContainer", "d-none");
}

/**
 * Sets event listeners for the board page.
 */
function setEventsBoard() {
  setEventListenerHoverBtn();
  setEventCloseDropDown();
  setEventsImageHoverAddTask("addTaskToDoImage");
  setEventsImageHoverAddTask("addTaskInProgressImage");
  setEventsImageHoverAddTask("addTaskAwaitingFeedbackImage");
  setEventsImageHoverAddTask("addTaskDoneImage");
}

/**
 * This function changes the source the add task image on hover.
 * @param {string} id - The ID of the image element.
 */
function setEventsImageHoverAddTask(id) {
  changeImageOnHover(
    id,
    "../assets/img/boardPlusBrightBlue.svg",
    "../assets/img/boardPlus.svg"
  );
}

/*SHOW TASKS IN BOARD***********************************************************************************/

/**
 * Renders the tasks on the board.
 */
async function renderTasks() {
  await getTasks();
  clearBoard();
  TASKS.forEach((task) => {
    setDataTaskCard(task);
  });
}

/**
 * Clears the task board by emptying the innerHTML of the board containers.
 */
function clearBoard() {
  document.getElementById("todo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitingFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";
}

/**
 * Sets the data for a task card.
 * @param {Object} task - The task object.
 */
function setDataTaskCard(task) {
  const indexOfTask = TASKS.indexOf(task);
  const processStep = task.process_step;
  const contacts = task.contacts;
  const amountSubtasks = task.subtasks.length;
  const classSubtasts = getStyleClassForSubtasks(amountSubtasks);
  const amountFinishedSubtasks = countAmountOfFinishedSubtasks(task);
  document.getElementById(processStep).innerHTML += renderTasksHtml(
    indexOfTask,
    task,
    amountSubtasks,
    amountFinishedSubtasks,
    classSubtasts
  );
  renderContactsInTaskCards(indexOfTask, contacts);
}

/**
 * Returns the style class for subtasks based on the amount of subtasks.
 * If the amount of subtasks is greater than 0, it returns "progressContainer".
 * Otherwise, it returns "d-none".
 * @param {number} amountSubtasks - The number of subtasks.
 * @returns {string} The style class for subtasks.
 */
function getStyleClassForSubtasks(amountSubtasks) {
  if (amountSubtasks > 0) {
    return "progressContainer";
  } else return "d-none";
}

/**
 * Counts the number of finished subtasks in a task.
 * @param {Object} task - The task object.
 * @returns {number} The number of finished subtasks.
 */
function countAmountOfFinishedSubtasks(task) {
  let amountFinishedSubtasks = 0;
  let subtasks = task.subtasks;
  subtasks.forEach((subtasks) => {
    const status = subtasks.status;
    if (status === true) {
      amountFinishedSubtasks++;
    }
  });
  return amountFinishedSubtasks;
}

/**
 * Renders contacts in a task card, including initials or "You" if user is assigned.
 * @param {number} indexOfTask - Index of the task in the task list.
 * @param {Array<Object>} contacts - Array of contact objects assigned to the task.
 */
async function renderContactsInTaskCards(indexOfTask, contacts) {
  const amountContacts = contacts.length;
  await renderFirstTwoContacts(indexOfTask, contacts);
  await renderRemainingAmountOfContacts(indexOfTask, amountContacts);
  document.getElementById("loadingContainer").classList.add("d-none");
}

/**
 * Renders the first two contacts of a task.
 * @param {number} indexOfTask - Index of the task.
 * @param {Array<Object>} contacts - Array of contact objects.
 */
function renderFirstTwoContacts(indexOfTask, contacts) {
  const maxContacts = Math.min(2, contacts.length);
  for (let i = 0; i < maxContacts; i++) {
    if (assignedContactIsLoggedUser(contacts[i])) {
      renderYouContact(indexOfTask, contacts[i]);
    } else {
      renderInitialsContacts(indexOfTask, contacts[i]);
    }
  }
}

/**
 * Checks if a contact is the currently logged-in user.
 * @param {Object} contact - Contact object.
 * @returns {boolean} True if the contact is the logged-in user.
 */
function assignedContactIsLoggedUser(contact) {
  return contact.email === LOGGED_USER.email;
}

/**
 * Renders a contact labeled as "You".
 * @param {number} indexOfTask - Index of the task.
 * @param {Object} contactsId - Contact object with a color property.
 */
function renderYouContact(indexOfTask, contactsId) {
  const initials = "You";
  const color = contactsId.color;
  appendContactHtml(indexOfTask, initials, color);
}

/**
 * Renders a contact using their initials.
 * @param {number} indexOfTask - Index of the task.
 * @param {Object} contact - Contact object with name and color.
 */
function renderInitialsContacts(indexOfTask, contact) {
  const initials = getInitials(contact.name);
  const color = contact.color;
  appendContactHtml(indexOfTask, initials, color);
}

/**
 * Renders the remaining amount of contacts in a task card.
 * @param {number} indexOfTask - The index of the task.
 * @param {number} amountContacts - The total number of contacts.
 */
function renderRemainingAmountOfContacts(indexOfTask, amountContacts) {
  if (amountContacts > 2) {
    const remainingContacts = "+" + (amountContacts - 2);
    appendContactHtml(indexOfTask, remainingContacts, "blue");
  }
}

/**
 * Appends contact HTML to the specified task card.
 * @param {number} indexOfTask - The index of the task.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The color of the contact.
 */
function appendContactHtml(indexOfTask, initials, color) {
  document.getElementById(`contacts${indexOfTask}`).innerHTML +=
    renderContactsInTaskCardsHtml(initials, color);
}

/**
 * Calculates the percentage progress of a task based on the amount of subtasks and finished subtasks.
 * @param {number} amountSubtasks - The total number of subtasks.
 * @param {number} amountFinishedSubtasks - The number of finished subtasks.
 * @returns {string} The percentage progress of the task.
 */
function getPercentageProgress(amountSubtasks, amountFinishedSubtasks) {
  return (amountFinishedSubtasks / amountSubtasks) * 100 + "%";
}

/*CHANGE PROCESS STEPS WITH ARROWS ON MOBILE DEVICES*******************************************************/

/**
 * Changes the process step of a task based on the given direction.
 * @param {number} indexOfTask - The index of the task in the TASKS array.
 * @param {string} direction - The direction of the process step change ("back" or "forward").
 */
function changeProcessStepOfTask(indexOfTask, direction) {
  let currentProcessStep = TASKS[indexOfTask].process_step;
  if (direction == "back") {
    let newProcessStepIndex = changeProcessStepOfTaskBack(currentProcessStep);
    changeProcessStepInData(indexOfTask, newProcessStepIndex);
  }
  if (direction == "forward") {
    let newProcessStepIndex =
      changeProcessStepOfTaskForward(currentProcessStep);
    changeProcessStepInData(indexOfTask, newProcessStepIndex);
  }
}

/**
 * Changes the process step of a task to the previous step.
 * @param {string} currentProcessStep - The current process step of the task.
 * @returns {number} - The index of the new process step.
 */
function changeProcessStepOfTaskBack(currentProcessStep) {
  let processStepsAmount = PROCESS_STEPS.length;
  let currentProcessStepIndex = PROCESS_STEPS.indexOf(currentProcessStep);

  let newProcessStepIndex = currentProcessStepIndex - 1;
  if (newProcessStepIndex < 0) {
    newProcessStepIndex = processStepsAmount - 1;
  }
  return newProcessStepIndex;
}

/**
 * Changes the process step of a task to the next step.
 * @param {string} currentProcessStep - The current process step of the task.
 * @returns {number} - The index of the new process step.
 */
function changeProcessStepOfTaskForward(currentProcessStep) {
  let processStepsAmount = PROCESS_STEPS.length;
  let currentProcessStepIndex = PROCESS_STEPS.indexOf(currentProcessStep);
  let newProcessStepIndex = currentProcessStepIndex + 1;
  if (newProcessStepIndex > processStepsAmount - 1) {
    newProcessStepIndex = 0;
  }
  return newProcessStepIndex;
}

/**
 * Changes the process step of a task in the data.
 * @param {number} indexOfTask - The index of the task in the TASKS array.
 * @param {number} newProcessStepIndex - The index of the new process step.
 */
async function changeProcessStepInData(indexOfTask, newProcessStepIndex) {
  await changeTask(TASKS[indexOfTask].id, "PATCH", {
    process_step: PROCESS_STEPS[newProcessStepIndex],
  });
  renderTasks();
}

/*DETAILS OF SINGLE TASK***********************************************************************************/

/**
 * Opens the task details for the selected/clicked index.
 * @param {number} indexOfTask - The index of the task.
 */
function openTaskDetails(indexOfTask) {
  SELECTED_TASK = TASKS[indexOfTask];
  renderTaskDetails();
  toggleClass("body", "overflowHidden");
  showDisplay("containerDetails", "animation-slideInRight", "d-none");
  changeImageOnHover(
    "deleteBtnImage",
    "../assets/img/boardDeleteTaskBrightBlue.svg",
    "../assets/img/boardDeleteTaskDarkBlue.svg"
  );
}

/**
 * Renders the task details.
 */
function renderTaskDetails() {
  const colorCategory = SELECTED_TASK.category.color;
  const colorPrio = getColorOfPrio(SELECTED_TASK.priority);
  document.getElementById("containerDetails").innerHTML = "";
  document.getElementById("containerDetails").innerHTML = renderTaskDetailsHtml(
    colorCategory,
    colorPrio
  );
  renderContactsInDetailCard();
  renderSubtasksInDetailCard();
}

/**
 * Renders the assigned contacts in the detail card.
 */
function renderContactsInDetailCard() {
  document.getElementById("assignedContactsDetailCard").innerHTML = "";
  const assignedContacts = SELECTED_TASK.contacts;
  assignedContacts.forEach((contact) => {
    if (assignedContactIsLoggedUser(contact)) {
      renderYouContactInDetailCard();
    } else {
      renderSavedContactsInDetailCard(contact);
    }
  });
}

/**
 * Renders the "You" contact in the detail task card if the logged user is not a guest.
 */
function renderYouContactInDetailCard() {
  const name = "You";
  const initials = "You";
  const color = "blue";
  document.getElementById("assignedContactsDetailCard").innerHTML +=
    renderContactsInDetailCardHtml(name, initials, color);
}

/**
 * Renders a saved contact inside the detail card by generating its HTML.
 * @param {Object} contact - The contact object to render.
 * @param {string} contact.name - The full name of the contact.
 * @param {string} contact.color - The color assigned to the contact.
 */
function renderSavedContactsInDetailCard(contact) {
  const name = contact.name;
  const initials = getInitials(name);
  const color = contact.color;
  document.getElementById("assignedContactsDetailCard").innerHTML +=
    renderContactsInDetailCardHtml(name, initials, color);
}

/**
 * Renders the subtasks in the task details card.
 */
function renderSubtasksInDetailCard() {
  document.getElementById("containerSubtasks").innerHTML = "";
  const indexOfTask = TASKS.indexOf(SELECTED_TASK);
  const subtasks = SELECTED_TASK.subtasks;

  subtasks.forEach((subtask) => {
    const name = subtask.name;
    let status = subtask.status;
    let statusHtml = setStatusSubtaskHtml(status);
    const indexOfSubtask = subtasks.indexOf(subtask);
    document.getElementById("containerSubtasks").innerHTML +=
      renderSubtasksInDetailCardHtml(
        name,
        statusHtml,
        indexOfSubtask,
        indexOfTask
      );
  });
}

/**
 * Converts a boolean subtask status to a string representation.
 * @param {boolean} status - The status of the subtask.
 * @returns {string} "checked" if true, otherwise "unchecked".
 */
function setStatusSubtaskHtml(status) {
  if (status == true) {
    status = "checked";
  } else {
    status = "unchecked";
  }
  return status;
}
