let SELECTED_TASK = "";

/**
 * Sets the navigation and header for the board page, loads data and sets the contacts and categories drop-down menu in the add task display.
 * @async
 */
async function initBoard() {
  await setNavAndHeader("board");
  await loadDataAndRenderTasks();
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
  await loadUserData();
  await getLoggedUser();
  await renderTasks();
  toggleClass("loadingContainer", "d-none");
}

/**
 * Sets event listeners for the board page.
 */
function setEventsBoard() {
  setEventCloseDropDown();
}

/*SHOW TASKS IN BOARD***********************************************************************************/

/**
 * Renders the tasks on the board.
 */
async function renderTasks() {
  clearBoard();
  TASKS = LOGGED_USER.tasks;
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
  const category = task.category;
  const colorCategory = getColorCategory(category);
  const processStep = task.processStep;
  const contactsIds = task.contacts;
  const amountSubtasks = task.subtasks.length;
  const amountFinishedSubtasks = countAmountOfFinishedSubtasks(task);
  document.getElementById(processStep).innerHTML += renderTasksHtml(
    indexOfTask,
    task,
    colorCategory,
    amountSubtasks,
    amountFinishedSubtasks
  );
  renderContactsInTaskCards(indexOfTask, contactsIds);
}

/**
 * Gets the color of a category by name.
 * @param {string} name - The name of the category.
 * @returns {string} The color of the category.
 */
function getColorCategory(name) {
  CATEGORYS = LOGGED_USER.categorys;
  const searchedCategory = CATEGORYS.find((category) => category.name === name);
  return searchedCategory.color;
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
    if (status === "checked") {
      amountFinishedSubtasks++;
    }
  });
  return amountFinishedSubtasks;
}

/**
 * Renders contacts initials in single task cards.
 * @param {number} indexOfTask - The index of the task.
 * @param {Array<number>} contactsIds - The IDs of the contacts.
 * @async
 */
async function renderContactsInTaskCards(indexOfTask, contactsIds) {
  const amountContacts = contactsIds.length;
  await renderFirstTwoContacts(indexOfTask, contactsIds);
  await renderRemainingAmountOfContacts(indexOfTask, amountContacts);
  document.getElementById("loadingContainer").classList.add("d-none");
}

/**
 * Renders the first two contacts in a task card.
 * @param {number} indexOfTask - The index of the task.
 * @param {Array<number>} contactsIds - The IDs of the contacts.
 */
function renderFirstTwoContacts(indexOfTask, contactsIds) {
  CONTACTS = LOGGED_USER.contacts;
  const maxContacts = Math.min(2, contactsIds.length);
  for (let i = 0; i < maxContacts; i++) {
    if (assignedContactIsLoggedUser(contactsIds[i])) {
      renderYouContact(indexOfTask);
    } else {
      renderInitialsContacts(indexOfTask, contactsIds[i]);
    }
  }
}

/**
 * Checks if the contact at the given id is the logged-in user.
 * @param {number} contactId - The id of the contact.
 * @returns {boolean} True if the contact is the logged-in user, false otherwise.
 */
function assignedContactIsLoggedUser(contactId) {
  return contactId === 0;
}

/**
 * Renders the "You" contact in a task card if the logged user is not a guest.
 * @param {number} indexOfTask - The index of the task.
 */
function renderYouContact(indexOfTask) {
  const initials = "You";
  const color = LOGGED_USER.color;
  appendContactHtml(indexOfTask, initials, color);
}

/**
 * Renders initials-based contacts in a task card.
 * @param {number} indexOfTask - The index of the task.
 * @param {number} contactId - The id of the contact.
 */
function renderInitialsContacts(indexOfTask, contactId) {
  const contactData = getContactData(contactId);
  const initials = contactData.initials;
  const color = contactData.color;
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
  const colorCategory = getColorCategory(SELECTED_TASK.category);
  document.getElementById("containerDetails").innerHTML = "";
  document.getElementById("containerDetails").innerHTML =
    renderTaskDetailsHtml(colorCategory);
  renderContactsInDetailCard();
  renderSubtasksInDetailCard();
}

/**
 * Renders the assigned contacts in the detail card.
 */
function renderContactsInDetailCard() {
  document.getElementById("assignedContactsDetailCard").innerHTML = "";
  const assignedContactIds = SELECTED_TASK.contacts;
  assignedContactIds.forEach((contactId) => {
    if (assignedContactIsLoggedUser(contactId)) {
      renderYouContactInDetailCard();
    } else {
      renderSavedContactsInDetailCard(contactId);
    }
  });
}

/**
 * Renders the "You" contact in the detail task card if the logged user is not a guest.
 */
function renderYouContactInDetailCard() {
  const name = "You";
  const initials = "You";
  const color = LOGGED_USER.color;
  document.getElementById("assignedContactsDetailCard").innerHTML +=
    renderContactsInDetailCardHtml(name, initials, color);
}

/**
 * Renders the saved contacts in the detail card.
 * @param {string} contactId - The ID of the contact.
 */
function renderSavedContactsInDetailCard(contactId) {
  const contactData = getContactData(contactId);
  const name = contactData.name;
  const initials = contactData.initials;
  const color = contactData.color;
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
    const status = subtask.status;
    const indexOfSubtask = subtasks.indexOf(subtask);
    document.getElementById("containerSubtasks").innerHTML +=
      renderSubtasksInDetailCardHtml(name, status, indexOfSubtask, indexOfTask);
  });
}
