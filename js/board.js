let TASKS = [];
let SELECTED_TASK = "";

async function initBoard() {
  await init("board");
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  await getLoggedUser();
  await renderTasks();
  setContactsAndCategorysDropDownMenu();
  setEventCloseDropDown();
  setEventListenerHoverBtn();
  toggleClass("loadingContainer", "d-none");
}

/*SHOW TASKS IN BOARD***********************************************************************************/

/**
 * Renders the tasks on the board.
 */
async function renderTasks() {
  clearBoard();
  TASKS = LOGGED_USER.tasks;
  if (TASKS.length === 0) {
    toggleClass("loadingContainer", "d-none");
  } else {
    TASKS.forEach((task) => {
      setDataTaskCard(task);
      renderContactsInTaskCards(indexOfTask, contactsIds);
    });
  }
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
function setDataTaskCard() {
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
    if (assignedContactIsLoggedUser(i)) {
      renderYouContact(indexOfTask)
    } else {
      renderInitialsContacts()
    }
  }
}

/**
 * Checks if the contact at the given index is the logged-in user.
 * @param {number} index - The index of the contact.
 * @returns {boolean} True if the contact is the logged-in user, false otherwise.
 */
function assignedContactIsLoggedUser(index) {
  return contactsIds[index] === 0
}

/**
 * Renders the "You" contact in a task card.
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
 * @param {number} indexOfAssignedContact - The index of the assigned contact.
 */
function renderInitialsContacts(indexOfTask, indexOfAssignedContact) {
  const contactData = getContactData(contactsIds[indexOfAssignedContact]);
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
  renderAssignedContacts();
  renderSubtasksInDetailCard();
}


function renderAssignedContacts() {
  document.getElementById("assignedContactsDetailCard").innerHTML = "";
  const assignedContactIds = SELECTED_TASK.contacts;
  assignedContactIds.forEach((contactId) => {
    if (contactId === 0) {
      const name = "You";
      const initials = "You";
      const color = LOGGED_USER.color;
      document.getElementById("assignedContactsDetailCard").innerHTML +=
        renderAssignedContactsHtml(name, initials, color);
    } else {
      const contactData = getContactData(contactId);
      const name = contactData.name;
      const initials = contactData.initials;
      const color = contactData.color;
      document.getElementById("assignedContactsDetailCard").innerHTML +=
        renderAssignedContactsHtml(name, initials, color);
    }
  });
}

/*EDIT TASK************************************************************************************************/

function renderEditTask() {
  hideDisplay("containerDetails", "d-none");
  showDisplay("contentAddTaskDisplay", "animation-slideInRight", "d-none");
  document.getElementById("clearBtn").classList.add("d-none");
  document.getElementById("createBtn").classList.add("d-none");
  document.getElementById("editBtn").classList.remove("d-none");<
  setTask();
}

function setTask() {
  let selectedCategory = SELECTED_TASK.category;
  let colorCategory = getColorCategory(selectedCategory);
  document.getElementById("titleInput").value = SELECTED_TASK.title;
  document.getElementById("descriptionInput").value = SELECTED_TASK.description;
  setSelectedCategory(selectedCategory, colorCategory);
  let contacts = SELECTED_TASK.contacts;
  contacts.forEach((contact) => {
    toggleCheckbox(contact);
  });
  document.getElementById("inputDueDate").value = SELECTED_TASK.dueDate;
  setPrioBtn();
  SUBTASKS = SELECTED_TASK.subtasks;
  renderSubtasks();
}

/**
 * Changes the style of the priority button for the selected task.
 */
function setPrioBtn() {
  let priority = SELECTED_TASK.priority;
  let backgroundColor = getColorOfPrio(priority);
  document.getElementById(priority).classList.add("selectedPrioBtn");
  SELECTED_PRIO_BTN = "";
  changeStylePrioBtn(priority, backgroundColor);
}

/**
 * Returns the color associated with the given priority level.
 * @param {string} priority - The priority level.
 * @returns {string} The color associated with the priority level.
 */
function getColorOfPrio(priority) {
  if (priority === "urgent") {
    return "red";
  } else if (priority === "medium") {
    return "orange";
  } else if (priority === "low") {
    return "green";
  }
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

/**
 * Changes the status of a subtask.
 * @param {number} indexOfTask - The index of the task.
 * @param {number} indexOfSubtask - The index of the subtask.
 */
async function changeStatusSubtask(indexOfTask, indexOfSubtask) {
  const checkbox = document.getElementById(
    `task${indexOfTask}subtask${indexOfSubtask}`
  );
  let status;
  if (checkbox.checked) {
    status = "checked";
  } else {
    status = "unchecked";
  }
  TASKS[indexOfTask].subtasks[indexOfSubtask].status = status;
  await setItem("users", JSON.stringify(USERS));
}

/**
 * Deletes the selected task and closes the opened display.
 */
async function deleteTask() {
  const indexOfTask = TASKS.indexOf(SELECTED_TASK);
  TASKS.splice(indexOfTask, 1);
  await setItem("users", JSON.stringify(USERS));
  hideDisplay("containerDetails", "d-none");
  toggleClass("body", "overflowHidden");
  initBoard();
}

/**
 * Edits the selected task.
 */
function editTask() {
  let task = {
    title: getTitle(),
    description: getDescription(),
    category: getCategory(),
    contacts: getSelectedCheckBoxes(),
    dueDate: getDueDate(),
    priority: getPriority(),
    subtasks: SUBTASKS,
  };
  checkAndOverwriteTask(task);
}

/**
 * Checks if the task has all the required data and overwrites the selected task with the new data.
 * @param {Object} task - The task object containing the updated data.
 * @async
 */
async function checkAndOverwriteTask(task) {
  if (requiredDataComplete(task)) {
    SELECTED_TASK.title = task.title;
    SELECTED_TASK.description = task.description;
    SELECTED_TASK.category = task.category;
    SELECTED_TASK.contacts = task.contacts;
    SELECTED_TASK.dueDate = task.dueDate;
    SELECTED_TASK.priority = task.priority;
    SELECTED_TASK.subtasks = task.subtasks;
    await setItem("users", JSON.stringify(USERS));
    loadTemplate("./board.html");
  }
}
