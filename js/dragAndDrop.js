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
async function moveTo(processStep) {
  TASKS[currentDraggedElement].processStep = processStep;
  await setItem("users", JSON.stringify(USERS));
  unhighlightArea(processStep);
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

// Touch events for drag and drop
function touchStart(event, index) {
  event.preventDefault();
  startDragging(index);
}

function touchMove(event) {
  event.preventDefault();
}

function touchEnd(event, processStep) {
  event.preventDefault();
  moveTo(processStep);
}

// Add touch event handlers to draggable elements
const draggableElements = document.getElementsByClassName("singleCard");
for (let i = 0; i < draggableElements.length; i++) {
  draggableElements[i].addEventListener("touchstart", (event) =>
    touchStart(event, i)
  );
  draggableElements[i].addEventListener("touchmove", touchMove);
  draggableElements[i].addEventListener("touchend", (event) =>
    touchEnd(event, draggableElements[i].parentNode.id)
  );
}
