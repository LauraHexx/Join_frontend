/*SUBTASKS*******************************************************************************/

/**
 * Adds a unchecked subtask to the SUBTASKS array and initialize rendering the updated list of subtasks.
 */
function addSubtask() {
  const subtask = addTaskSubtasks.value;
  if (subtask) {
    SUBTASKS.push({
      name: subtask,
      status: false,
    });
    document.getElementById("addTaskSubtasks").value = "";
    renderSubtasks();
  }
}

/**
 * Renders the list of subtasks.
 */
function renderSubtasks() {
  document.getElementById("subtasks").innerHTML = "";
  SUBTASKS.forEach((subtask) => {
    const indexOfSubtask = SUBTASKS.indexOf(subtask);
    const status = subtask.status;
    document.getElementById("subtasks").innerHTML += renderSubtasksHtml(
      subtask,
      indexOfSubtask,
      status
    );
  });
}

/**
 * Sets the status of a subtask based on the checkbox state.
 * @param {number} indexOfSubtask - The index of the subtask in the SUBTASKS array.
 */
function setStatusCheckbox(indexOfSubtask) {
  const checkbox = document.getElementById(`subtask${indexOfSubtask}`);
  let status;
  if (checkbox.checked) {
    status = true;
  } else {
    status = false;
  }
  SUBTASKS[indexOfSubtask].status = status;
}
