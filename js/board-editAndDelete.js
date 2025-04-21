/*EDIT AND DELETE TASK************************************************************************************************/

/**
 * Renders the edit task display.
 */
function renderEditTask() {
  hideDisplay("containerDetails", "animation-slideInRight", "d-none");
  showDisplay("contentAddTaskDisplay", "animation-slideInRight", "d-none");
  changeStyleBtnsInEditTask();
  setDataTaskToEditDisplay();
}

/**
 * Changes the style of buttons in the edit task display.
 */
function changeStyleBtnsInEditTask() {
  document.getElementById("clearBtn").classList.add("d-none");
  document.getElementById("createBtn").classList.add("d-none");
  document.getElementById("editBtn").classList.remove("d-none");
}

/**
 * Sets the data of the selected task to the edit display.
 */
function setDataTaskToEditDisplay() {
  setTitleAndDescriptionToEditDisplay();
  renderSelectedCategory(
    SELECTED_TASK.category.name,
    SELECTED_TASK.category.color
  );
  setContactsToEditDisplay();
  setDueDateToEditDisplay();
  setPrioBtnsToEditDisplay();
  setSubtasksToEditDisplay();
}

/**
 * Sets the title and description of the selected task to the edit display.
 */
function setTitleAndDescriptionToEditDisplay() {
  document.getElementById("titleInput").value = SELECTED_TASK.title;
  document.getElementById("descriptionInput").value = SELECTED_TASK.description;
}

/**
 * Sets the contacts of the selected task to the edit display.
 */
function setContactsToEditDisplay() {
  let contacts = SELECTED_TASK.contacts;
  contacts.forEach((contact) => {
    toggleCheckbox(contact.id);
  });
}

/**
 * Sets the due date of the selected task to the edit display.
 */
function setDueDateToEditDisplay() {
  document.getElementById("inputDueDate").value = SELECTED_TASK.due_date;
}

/**
 * Changes the style of the priority button for the selected task.
 */
function setPrioBtnsToEditDisplay() {
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
 * Sets subtasks from selected task and renders them.
 */
function setSubtasksToEditDisplay() {
  SUBTASKS = SELECTED_TASK.subtasks;
  renderSubtasks();
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
    status = true;
  } else {
    status = false;
  }
  await changeTask(SELECTED_TASK.id, "PATCH", { status: status });
  hideDisplay("containerDetails", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  renderTasks();
}

/**
 * Deletes the selected task and closes the opened display.
 */
async function deleteTask() {
  const indexOfTask = TASKS.indexOf(SELECTED_TASK);
  TASKS.splice(indexOfTask, 1);
  await changeTask(SELECTED_TASK.id, "DELETE");
  hideDisplay("containerDetails", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  renderTasks();
}

/**
 * Edits the selected task.
 */
function editTask() {
  let task = {
    title: getDataFromInput("titleInput", "errorTitle"),
    description: getDataFromInput("descriptionInput", "errorDescription"),
    category_id: getCategoryId(),
    contact_ids: getSelectedCheckBoxes(),
    due_date: getDataFromInput("inputDueDate", "errorDueDate"),
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
  if (requiredDataTaskComplete(task)) {
    SELECTED_TASK.title = task.title;
    SELECTED_TASK.description = task.description;
    SELECTED_TASK.category = task.category;
    SELECTED_TASK.contacts = task.contacts;
    SELECTED_TASK.dueDate = task.dueDate;
    SELECTED_TASK.priority = task.priority;
    SELECTED_TASK.subtasks = task.subtasks;
    await changeTask(SELECTED_TASK.id, "PUT", task);
    await loadDataAndRenderTasks();
    closeAddTask();
  }
}
