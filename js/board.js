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
  renderTasks();
}

function renderTasks() {
  TASKS.forEach((task) => {
    const indexOfTask = TASKS.indexOf(task);
    const category = task.category;
    const colorCategory = getColorCategory(category);
    const processStep = task.processStep;
    const contactsIds = task.contacts;
    document.getElementById(processStep).innerHTML += renderTasksHtml(
      indexOfTask,
      task,
      colorCategory
    );
    renderContactsInTasks(indexOfTask, contactsIds);
  });
}

/**
 * Get the color based on the given name.
 *
 * @param {string} name - The name to look up.
 * @returns {string} The color associated with the given name.
 */
function getColorCategory(name) {
  const category = CATEGORYS.find((category) => category.name === name);
  return category.color;
}

function renderTasksHtml(indexOfTask, task, colorCategory) {
  return /*html*/ `
    <div id=${indexOfTask} class="singleCard" onclick="toggleClass('body', 'overflowHidden'); showEditTask('containerEdit','animation-slideInRight','d-none')">
      <div class="category" id=${colorCategory}>${task.category}</div>
      <div id="title">${task.title}</div>
      <span id="description">${task.description}</span>
      <div id="progressContainer">
        <div id="progress">
          <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <span id="progressAmount">1/2 Done</span>
      </div>
      <div id="contactsAndPrio">
        <div class="assignedContacts" id="contacts${indexOfTask}">

        </div>
        <img id="prio" src="../assets/img/prioLow.svg" alt="icon to show priority">
      </div>
    </div>
  `;
}

function renderContactsInTasks(indexOfTask, contactsIds) {
  let amountContacts = contactsIds.length;
  for (let i = 0; i < 2; i++) {
    const contactData = getUserData(contactsIds[i]);
    const initials = contactData.initials;
    document.getElementById(`contacts${indexOfTask}`).innerHTML =
      renderContactsInTasksHtml(initials);
  }
}

function renderContactsInTasksHtml(initials) {
  return /*html*/ `
    <div class="initialsOfNames smallCircle">BB</div>
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
