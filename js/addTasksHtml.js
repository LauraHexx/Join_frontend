function renderCategorysHtml(name, color) {
  return /*html*/ `
      <li onclick="renderSelectedCategory('${name}','${color}')" class="singleCategory">
        <span>${name}</span>
        <div class="circle ${color}"></div>
      </li>
    `;
}

function renderSelectedCategoryHtml(name, color) {
  return /*html*/ `
    <li class="selectedCategory">
      <span id='selectedCategoryName'>${name}</span>
      <div class="${color} circle colorOfCategory"></div>
    </li>
  `;
}

function renderContactsHtml(name, id) {
  return /*html*/ `
      <li class="oneContact" onclick="event.stopPropagation();">
        <div onclick="toggleCheckbox(${id})" class="toggleCheckbox"></div>
        <label class="nameOfContact">${name}</label>
        <input id="checkBoxUser${id}" type="checkbox"/>
      </li>
    `;
}

function renderSubtasksHtml(subtask, indexOfSubtask, status) {
  return /*html*/ `
      <div class="singleSubtask">
        <input onclick="setStatusCheckbox(${indexOfSubtask})" ${status} type="checkbox" id="subtask${indexOfSubtask}" class="checkbox">
        <span class="subtask">${subtask.name}</span>
      </div>
    `;
}
