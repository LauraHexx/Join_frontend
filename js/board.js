let currentDraggedElement;

async function initBoard() {
  await loadUsers();
  await checkIfUserLoggedIn();
  await loadTasks();
  await loadCategorys();
  await init("board");
  changeImageOnHover(
    "deleteBtnImage",
    "../assets/img/boardDeleteTaskBrightBlue.svg",
    "../assets/img/boardDeleteTaskDarkBlue.svg"
  );
}

function renderTasks() {
  TASKS.forEach((task) => {
    const processStepp = task.processStep;
    const category = task.category;
    const colorCategory = getColorCategory(category);
    const title = task.title;
    const description = task.description;
    const contacts = task.contacts;
    document.getElementById(processStepp).innerHTML += renderTasksHtml(task);
  });
}

/**
 * Get the color based on the given name.
 *
 * @param {string} name - The name to look up.
 * @returns {string} The color associated with the given name.
 */
function getColorByName(name) {
  const category = CATEGORYS.find((category) => category.name === name);
  return category.color;
}

function renderTasksHtml(task) {
  return /*html*/ `
    <div id="1" class="singleCard" onclick="toggleClass('body', 'overflowHidden'); showEditTask('containerEdit','animation-slideInRight','d-none')" draggable="true" ondragstart="startDragging(1)">
      <div id="category">${task.category}</div>
      <div id="title">${task.title}</div>
      <span id="description">
      ${task.title}
      </span>
      <div id="progressContainer">
        <div id="progress">
          <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <span id="progressAmount">1/2 Done</span>
      </div>
      <div id="contactsAndPrio">
        <div id="assignedContacts">
          <div class="initialsOfNames smallCircle">BB</div>
          <div class="initialsOfNames smallCircle">BB</div>
          <div class="initialsOfNames smallCircle">+2</div>
        </div>
        <img id="prio" src="../assets/img/prioLow.svg" alt="icon to show priority">
      </div>
    </div>
  `;
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {}

function showEditTask(id, animationClass, className) {
  toggleClass(id, className);
  playAnimation(id, animationClass);
  toggleBlurFilter();
}

function hideEditTask(id, className) {
  toggleClass(id, className);
  toggleBlurFilter();
}
