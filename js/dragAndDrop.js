let currentDraggedElement;

/**
 * Sets the current dragged element index.
 * @param {number} index - The index of the element being dragged.
 */
function startDragging(index) {
  currentDraggedElement = index;
}

/**
 * Allows dropping of dragged elements.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves the dragged element to the specified process step.
 * @param {string} processStep - The process step to move the element to.
 */
async function moveTo(processStep, highlightArea) {
  TASKS[currentDraggedElement].processStep = processStep;
  await setItem("users", JSON.stringify(USERS));
  unhighlightArea(highlightArea);
  renderTasks();
}

/**
 * Highlights the drag area.
 * @param {string} id - The ID of the area to highlight.
 */
function highlightArea(id) {
  document.getElementById(id).classList.add("dragArea");
}

/**
 * Removes the highlight from the drag area.
 * @param {string} id - The ID of the area to unhighlight.
 */
function unhighlightArea(id) {
  document.getElementById(id).classList.remove("dragArea");
}
