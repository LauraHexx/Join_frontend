function renderTasksHtml(
  indexOfTask,
  task,
  amountSubtasks,
  amountFinishedSubtasks,
  classSubtasts
) {
  return /*html*/ `
  <div draggable="true" ondragstart="startDragging(${indexOfTask})" id="task${indexOfTask}" class="singleCard" onclick="openTaskDetails(${indexOfTask}, '${
    task.category.color
  }')">
    <div class="headTaskCard">
    <div class="category fontSize14px" style="background-color: ${
      task.category.color
    };">${task.category.name}</div>
      <div onclick="event.stopPropagation()" class="containerArrows">
        <img onclick="changeProcessStepOfTask(${indexOfTask},'back')" class="prio" src="../assets/img/arrowUp.png" alt="icon change processStep back">
        <img onclick="changeProcessStepOfTask(${indexOfTask},'forward')" class="prio" src="../assets/img/arrowDown.png" alt="icon change processStep forward">
      </div>
    </div>
    <div class="bold fontSize14px title">${task.title}</div>
    <span class="description fontSize14px">${task.description}</span>
    <div class="${classSubtasts}">
      <div class="progress">
        <div class="progress-bar" style="width: ${getPercentageProgress(
          amountSubtasks,
          amountFinishedSubtasks
        )}" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <span id="progressAmount">${amountFinishedSubtasks}/${amountSubtasks} Done</span>
    </div>
    <div class="contactsAndPrio">
      <div class="assignedContacts" id="contacts${indexOfTask}"></div>
      <img class="prio" src="../assets/img/${
        task.priority
      }.svg" alt="icon to show priority">
    </div>
  </div>
`;
}

function renderTaskDetailsHtml(colorCategory, colorPrio) {
  return /*html*/ `
      <div onclick="event.stopPropagation()" class="displayEdit">
        <div class="headContainer">
          <div class="category" style="background-color: ${colorCategory}">${SELECTED_TASK.category.name}</div>
          <img onclick= "hideDisplay('containerDetails','animation-slideInRight', 'd-none'); toggleClass('body', 'overflowHidden')" src="../assets/img/boardCloseDisplay.svg" alt="icon to close display">
        </div>
        <span id="titleDisplay">${SELECTED_TASK.title}</span>
        <span id="descriptionDisplay">${SELECTED_TASK.description}</span>
        <section class="containerSectionBoard">
          <span class="bold">Due date:</span>
          <span id="dueDate">${SELECTED_TASK.due_date}</span>
        </section>
        <section class="containerSectionBoard">
          <span class="bold">Priority:</span>
          <button style="background-color: ${colorPrio}" id="priorityDisplay">
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

function renderContactsInDetailCardHtml(name, initials, color) {
  return /*html*/ `
      <div class="singleContact">
        <div class="initialsOfNames smallCircle" style="background-color:${color}">${initials}</div>
        <span id="nameOfContact">${name}</span>
      </div> 
    `;
}

function renderSubtasksInDetailCardHtml(
  name,
  status,
  indexOfSubtask,
  indexOfTask
) {
  return /*html*/ `
      <div class="singleSubtask">
         <span>${name}</span>
      </div>
    `;
}

function renderContactsInTaskCardsHtml(initials, color) {
  return /*html*/ `
      <div class="initialsOfNames smallCircle" style="background-color:${color}">${initials}</div>
    `;
}
