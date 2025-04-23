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
    let status = subtask.status;
    if (status == true) {
      status = "checked";
    } else {
      status = "unchecked";
    }
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

/**
 * Starts the editing process for a specific subtask.
 * @param {number} indexOfSubtask - Index of the subtask to edit.
 */
async function editCurrentSubtask(indexOfSubtask) {
  const subtaskToEdit = getSubtaskToEdit(indexOfSubtask);
  const inputField = createInputField(subtaskToEdit.innerText, indexOfSubtask);
  replaceWithInputField(subtaskToEdit, inputField);
  setInputFocusAndCursor(indexOfSubtask);
  startBlinking(inputField);
  stopBlinkingAndSave(inputField, subtaskToEdit, indexOfSubtask);
}

/**
 * Gets the span element of the subtask by index.
 * @param {number} indexOfSubtask
 * @returns {HTMLElement} Subtask span element
 */
function getSubtaskToEdit(indexOfSubtask) {
  return document.getElementById(`subtask-name-id${indexOfSubtask}`);
}

/**
 * Creates an input element for editing the subtask.
 * @param {string} currentText - Current subtask text.
 * @param {number} indexOfSubtask
 * @returns {HTMLInputElement}
 */
function createInputField(currentText, indexOfSubtask) {
  const input = document.createElement("input");
  input.value = currentText;
  input.classList.add("editable-subtask-input");
  input.id = `input-subtask-${indexOfSubtask}`;
  return input;
}

/**
 * Replaces the span with an input field.
 * @param {HTMLElement} subtaskToEdit
 * @param {HTMLInputElement} inputField
 */
function replaceWithInputField(subtaskToEdit, inputField) {
  subtaskToEdit.parentNode.replaceChild(inputField, subtaskToEdit);
}

/**
 * Sets focus and cursor to the input field.
 * @param {number} indexOfSubtask
 */
function setInputFocusAndCursor(indexOfSubtask) {
  const input = document.getElementById(`input-subtask-${indexOfSubtask}`);
  input.focus();
  input.setSelectionRange(0, 0);
}

/**
 * Adds blinking cursor class to input.
 * @param {HTMLInputElement} inputField
 */
function startBlinking(inputField) {
  inputField.classList.add("blinking-cursor");
}

/**
 * Stops blinking, saves new text and updates SUBTASKS.
 * @param {HTMLInputElement} inputField
 * @param {HTMLElement} subtaskToEdit
 * @param {number} indexOfSubtask
 */
function stopBlinkingAndSave(inputField, subtaskToEdit, indexOfSubtask) {
  inputField.addEventListener("blur", () => {
    const newSpan = document.createElement("span");
    newSpan.id = `subtask-name-id${indexOfSubtask}`;
    newSpan.classList.add("subtask");
    newSpan.innerText = inputField.value;
    inputField.parentNode.replaceChild(newSpan, inputField);
    SUBTASKS[indexOfSubtask].name = newSpan.innerText;
    console.log(SUBTASKS);
  });

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      inputField.blur();
    }
  });
}

/**
 * Deletes subtask from list and re-renders UI.
 * @param {number} indexOfSubtask
 */
function deleteCurrentSubtask(indexOfSubtask) {
  SUBTASKS.splice(indexOfSubtask, 1);
  renderSubtasks();
  renderTasks();
}
