let currentDraggedElement;

function startDragging(index) {
  currentDraggedElement = index;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(processStep) {
  TASKS[currentDraggedElement].processStep = processStep;
  await setItem("users", JSON.stringify(USERS));
  unhighlightArea(processStep);
  renderTasks();
}

function highlightArea(id) {
  document.getElementById(id).classList.add("dragArea");
}

function unhighlightArea(id) {
  document.getElementById(id).classList.remove("dragArea");
}
