let currentDraggedElement;
let TASKS = [];
let SELECTED_TASK = "";

async function initBoard() {
  await init("board");
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  await getLoggedUser();
  setContactsAndCategorysDropDownMenu();
  setEventCloseDropDown();
  renderTasks();
}

function renderTasks() {
  clearBoard();
  TASKS = LOGGED_USER.tasks;
  if (TASKS.length === 0) {
    toggleClass("loadingContainer", "d-none");
  } else {
    TASKS.forEach((task) => {
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
    });
    toggleClass("loadingContainer", "d-none");
  }
}

function clearBoard() {
  document.getElementById("todo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitingFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";
}

function getColorCategory(name) {
  CATEGORYS = LOGGED_USER.categorys;
  const searchedCategory = CATEGORYS.find((category) => category.name === name);
  return searchedCategory.color;
}

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

function renderTasksHtml(
  indexOfTask,
  task,
  colorCategory,
  amountSubtasks,
  amountFinishedSubtasks
) {
  return /*html*/ `
    <div draggable="true" ondragstart="startDragging(${indexOfTask})" id="task${indexOfTask}" class="singleCard" onclick="openTaskDetails(${indexOfTask},${colorCategory})">
      <div class="category ${colorCategory}">${task.category}</div>
      <div id="title">${task.title}</div>
      <span id="description">${task.description}</span>
      <div id="progressContainer">
        <div id="progress">
          <div class="progress-bar" style="width: ${getPercentageProgress(
            amountSubtasks,
            amountFinishedSubtasks
          )}" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <span id="progressAmount">${amountFinishedSubtasks}/${amountSubtasks} Done</span>
      </div>
      <div id="contactsAndPrio">
        <div class="assignedContacts" id="contacts${indexOfTask}"></div>
        <img id="prio" src="../assets/img/prio${
          task.priority
        }.svg" alt="icon to show priority">
      </div>
    </div>
  `;
}

function getPercentageProgress(amountSubtasks, amountFinishedSubtasks) {
  return (amountFinishedSubtasks / amountSubtasks) * 100 + "%";
}

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

function renderTaskDetails() {
  const colorCategory = getColorCategory(SELECTED_TASK.category);
  document.getElementById("containerDetails").innerHTML = "";
  document.getElementById("containerDetails").innerHTML =
    renderTaskDetailsHtml(colorCategory);
  renderAssignedContacts();
  renderSubtasksInDetailCard();
}

function renderTaskDetailsHtml(colorCategory) {
  return /*html*/ `
    <div class="displayEdit">
      <div class="headContainer">
        <div class="category ${colorCategory}">${SELECTED_TASK.category}</div>
        <img onclick="initBoard(); hideDisplay('containerDetails', 'd-none'); toggleClass('body', 'overflowHidden')" src="../assets/img/boardCloseDisplay.svg" alt="icon to close display">
      </div>
      <span id="titleDisplay">${SELECTED_TASK.title}</span>
      <span id="descriptionDisplay">${SELECTED_TASK.description}</span>
      <section class="containerSectionBoard">
        <span class="bold">Due date:</span>
        <span id="dueDate">${SELECTED_TASK.dueDate}</span>
      </section>
      <section class="containerSectionBoard">
        <span class="bold">Priority:</span>
        <button id="priorityDisplay">
          ${SELECTED_TASK.priority}
          <img src="../assets/img/boardPriorityWhite.svg" alt="icon of priority">
        </button>
      </section>
      <section class="subtasks">
        <span class="bold">Subtasks:</span>
        <div id="containerSubtasks"></div>
      </section>
      <section class="containerAssignedTo">
        <span class="bold">Assigned To:</span>
        <div id="assignedContactsDetailCard"></div>
      </section>
      <div class="btnContainer">
        <button onclick="deleteTask()" class="deleteBtn"><img id="deleteBtnImage" src="../assets/img/boardDeleteTaskDarkBlue.svg" alt="icon to delete task"></button>
        <button onclick="renderEditTask()" class="editBtn"><img src="../assets/img/boardEditTask.svg" alt="icon to edit task"></button>
      </div>
    </div>  
  `;
}

function renderEditTask() {
  hideDisplay("containerDetails", "d-none");
  showDisplay("contentAddTaskDisplay", "animation-slideInRight", "d-none");
  document.getElementById("clearBtn").classList.add("d-none");
  document.getElementById("createBtn").classList.add("d-none");
  document.getElementById("editBtn").classList.remove("d-none");
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

function setPrioBtn() {
  let priority = SELECTED_TASK.priority;
  let backgroundColor = getColorOfPrio(priority);
  document.getElementById(priority).classList.add("selectedPrioBtn");
  SELECTED_PRIO_BTN = "";
  changeStylePrioBtn(priority, backgroundColor);
}

function getColorOfPrio(priority) {
  if (priority === "urgent") {
    return "red";
  } else if (priority === "medium") {
    return "orange";
  } else if (priority === "low") {
    return "green";
  }
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

function renderAssignedContactsHtml(name, initials, color) {
  return /*html*/ `
    <div class="singleContact">
      <div class="initialsOfNames smallCircle" style="background-color:${color}">${initials}</div>
      <span id="nameOfContact">${name}</span>
    </div> 
  `;
}

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

function renderSubtasksInDetailCardHtml(
  name,
  status,
  indexOfSubtask,
  indexOfTask
) {
  return /*html*/ `
    <div class="singleSubtask">
       <input type="checkbox" onclick="changeStatusSubtask(${indexOfTask},${indexOfSubtask})" ${status} id="task${indexOfTask}subtask${indexOfSubtask}" class="checkbox">
       <span>${name}</span>
    </div>
  `;
}

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

async function renderContactsInTaskCards(indexOfTask, contactsIds) {
  const amountContacts = contactsIds.length;
  await renderFirstTwoContacts(indexOfTask, contactsIds);
  await renderRemainingAmountOfContacts(indexOfTask, amountContacts);
  document.getElementById("loadingContainer").classList.add("d-none");
}

function renderFirstTwoContacts(indexOfTask, contactsIds) {
  CONTACTS = LOGGED_USER.contacts;
  const maxContacts = Math.min(2, contactsIds.length);
  for (let i = 0; i < maxContacts; i++) {
    let initials, color;
    if (contactsIds[i] === 0) {
      initials = "You";
      color = LOGGED_USER.color;
      appendContactHtml(indexOfTask, initials, color);
    } else {
      const contactData = getContactData(contactsIds[i]);
      initials = contactData.initials;
      color = contactData.color;
      appendContactHtml(indexOfTask, initials, color);
    }
  }
}

function renderRemainingAmountOfContacts(indexOfTask, amountContacts) {
  if (amountContacts > 2) {
    const remainingContacts = "+" + (amountContacts - 2);
    appendContactHtml(indexOfTask, remainingContacts, "blue");
  }
}

function appendContactHtml(indexOfTask, initials, color) {
  document.getElementById(`contacts${indexOfTask}`).innerHTML +=
    renderContactsInTaskCardsHtml(initials, color);
}

function renderContactsInTaskCardsHtml(initials, color) {
  return /*html*/ `
    <div class="initialsOfNames smallCircle" style="background-color:${color}">${initials}</div>
  `;
}

async function deleteTask() {
  const indexOfTask = TASKS.indexOf(SELECTED_TASK);
  TASKS.splice(indexOfTask, 1);
  await setItem("users", JSON.stringify(USERS));
  hideDisplay("containerDetails", "d-none");
  toggleClass("body", "overflowHidden");
  initBoard();
}

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

/*DRAG AND DROP */

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {}

/*
function closeEditTask() {
  toggleClass("body", "overflowHidden");
  showDisplay("contentAddTaskDisplay", "animation-slideInRight", "d-none");
  clearTask();
}

function showEditTask(id, animationClass, className) {
  toggleClass(id, className);
  playAnimation(id, animationClass);
  toggleBlurFilter();
}

function closeTaskDetails(id, className) {
  toggleClass(id, className);
  toggleBlurFilter();
  toggleClass("body", "overflowHidden");
}
*/
