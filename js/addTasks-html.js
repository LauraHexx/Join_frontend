function renderCategorysHtml(name, color) {
  return /*html*/ `
      <li onclick="renderSelectedCategory('${name}','${color}')" class="singleCategory">
        <span>${name}</span>
        <div class="circle" style="background-color: ${color}" ></div>
      </li>
    `;
}

function renderSelectedCategoryHtml(name, color) {
  return /*html*/ `
    <li class="selectedCategory">
      <span id='selectedCategoryName'>${name}</span>
      <div class="circle colorOfCategory" style="background-color: ${color}"></div>
    </li>
  `;
}

function renderYouContactHtml(name, id, color) {
  return /*html*/ `
      <li class="oneContact" onclick="event.stopPropagation();">
        <div onclick="toggleCheckbox(${id}, '${name}', '${color}')" class="toggleCheckbox"></div>
        <label class="nameOfContact">You</label>
        <input id="checkBoxUser${id}" type="checkbox"/>
      </li>
  `;
}

function renderContactsHtml(name, id, color) {
  return /*html*/ `
      <li class="oneContact" onclick="event.stopPropagation();">
        <div onclick="toggleCheckbox(${id}, '${name}', '${color}')" class="toggleCheckbox"></div>
        <label class="nameOfContact">${name}</label>
        <input id="checkBoxUser${id}" type="checkbox"/>
      </li>
  `;
}

function renderTwoClickedContactsHtml(clickedContact, initials) {
  return /*html*/ `
      <div id="clickedContact${clickedContact.id}" style="background-color: ${clickedContact.color}" class="initialsOfClickedContact circleContact">
        ${initials}
      </div>
  `;
}

function renderRestAmountClickedContactsHtml(furtherAmountOfContacts) {
  return /*html*/ `
      <div style="background-color: blue" class="initialsOfClickedContact circleContact">
        +${furtherAmountOfContacts}
      </div>
  `;
}

function renderSubtasksHtml(subtask, indexOfSubtask, status) {
  return /*html*/ `      
      <div class="singleSubtask">
          <div id="subtaskContent">
              <input onclick="setStatusCheckbox(${indexOfSubtask})" ${status} type="checkbox" id="subtask${indexOfSubtask}" class="checkbox">
              <span id="subtask-name-id${indexOfSubtask}" class="subtask subtaskName">${subtask.name}</span>
          </div>
          <div id="subtaskImgs">
              <img onclick="editCurrentSubtask(${indexOfSubtask})" id="editImgSubtask"  src="../assets/img/pencilBlue.svg" alt="icon to edit task">
              <img onclick="deleteCurrentSubtask(${indexOfSubtask})" id="deleteImgSubtask" src="../assets/img/boardDeleteTaskDarkBlue.svg" alt="icon to delete task">
          </div>
      </div>
    `;
}
