let SELECTED_PRIO_BTN;
let SUBTASKS = [];
let TASKS = [];

async function initAddTask() {
  await loadUsers();
  await checkIfUserLoggedIn();
  await loadCategorys();
  await renderCategorys();
  await sortUsersAlphabetically();
  await renderContacts();
  await showContentOfTemplate();
}

async function showContentOfTemplate() {
  init("addTask");
  document.getElementById("content").classList.remove("d-none");
}

/*CATEGORY******************************************************************************/

function renderCategorys() {
  document.getElementById("selectableCategorys").innerHTML = "";
  CATEGORYS.forEach((category) => {
    const name = category.name;
    const color = category.color;
    document.getElementById("selectableCategorys").innerHTML +=
      renderCategorysHtml(name, color);
  });
}

function renderCategorysHtml(name, color) {
  return /*html*/ `
    <li onclick="changeTitleCategoryInput('${name}','${color}')" class="singleCategory">
      <span>${name}</span>
      <div id=${color} class="circle selectedColor"></div>
    </li>
  `;
}

function changeTitleCategoryInput(name, color) {
  const selectCategoryTitle = document.getElementById("selectCategoryTitle");
  selectCategoryTitle.innerHTML = /*html*/ `
    <li class="selectedCategory">
      <span id='selectedCategoryName'>${name}</span>
      <div id="${color}" class="circle colorOfCategory"></div>
    </li>
  `;
}

async function addCategory() {
  let newCategory = getCategory();
  let colour = getSelectedColor();
  checkAndPushCategory(newCategory, colour);
  await sortCategorysAlphabetically();
  setItem("categorys", JSON.stringify(CATEGORYS));
  renderCategorys();
}

async function sortCategorysAlphabetically() {
  CATEGORYS = CATEGORYS.sort((a, b) => a.name.localeCompare(b.name));
}

function getCategory() {
  const newCategory = document.getElementById("categoryInput").value;
  if (noCategoryEntered(newCategory)) {
    showErrorsNoCategoryEntered();
    return;
  }
  if (categoryAlreadyExists(newCategory)) {
    showErrorsCategoryAlreadyExists();
    return;
  }
  deleteAllErrors();
  return newCategory;
}

function noCategoryEntered(newCategory) {
  return !newCategory;
}

function showErrorsNoCategoryEntered() {
  document.getElementById("errorNameExists").classList.add("d-none");
  document.getElementById("errorName").classList.remove("d-none");
}

function categoryAlreadyExists(newCategory) {
  return CATEGORYS.find((category) => category.name === newCategory);
}

function showErrorsCategoryAlreadyExists() {
  document.getElementById("errorNameExists").classList.remove("d-none");
  document.getElementById("errorName").classList.add("d-none");
}

function deleteAllErrors() {
  document.getElementById("errorNameExists").classList.add("d-none");
  document.getElementById("errorName").classList.add("d-none");
}

/**
 * This function retrieves the ID of the div element that has the class "selectedColor".
 *
 * @returns {string|null} The ID of the selected div element, or null if no element is selected.
 */
function getSelectedColor() {
  const selectedColor = document.querySelector(".selectedColor");
  if (colorWasSelected(selectedColor)) {
    deleteColorError(selectedColor);
    return selectedColor.id;
  } else {
    showErrorNoColorSelected();
    return;
  }
}

function colorWasSelected(selectedColor) {
  return selectedColor;
}

function deleteColorError(selectedColor) {
  document.getElementById("errorColor").classList.add("d-none");
}

function showErrorNoColorSelected() {
  document.getElementById("errorColor").classList.remove("d-none");
}

async function checkAndPushCategory(newCategory, colour) {
  if (newCategory && colour) {
    CATEGORYS.push({
      name: newCategory,
      color: colour,
    });
    changeStyleCategory();
  }
}

function changeStyleCategory() {
  toggleClass("selectCategory", "d-none");
  toggleClass("newCategory", "d-none");
  toggleClass("listCategorys", "d-none");
  toggleClass("categorysColours", "d-none");
}

function moveCircle(event) {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    if (circle === event.target) {
      circle.classList.add("selectedColor");
    } else {
      circle.classList.remove("selectedColor");
    }
  });
}

/*CONTACTS******************************************************************************/

async function sortUsersAlphabetically() {
  USERS = USERS.sort((a, b) => a.initials.localeCompare(b.initials));
}

function renderContacts() {
  const filteredUsers = USERS.filter((user) => user.id !== LOGGED_USER.id);
  document.getElementById("savedContacts").innerHTML = "";
  filteredUsers.forEach((user) => {
    const name = user.name;
    const id = user.id;
    document.getElementById("savedContacts").innerHTML += renderContactsHtml(
      name,
      id
    );
  });
  checkIfLoggedUserShouldBeRendered();
}

function renderContactsHtml(name, id) {
  return /*html*/ `
    <li class="oneContact">
      <div onclick="toggleCheckbox(${id})" class="toggleCheckbox"></div>
      <label class="nameOfContact">${name}</label>
      <input id="checkBoxUser${id}" type="checkbox"/>
    </li>
  `;
}

function checkIfLoggedUserShouldBeRendered() {
  if (LOGGED_USER == "Guest") {
    return;
  } else {
    document.getElementById("loggedUserContact").innerHTML =
      renderLoggedUserContactHtml();
  }
}

function renderLoggedUserContactHtml() {
  return /*html*/ `
     <li class="oneContact">
      <div onclick="toggleCheckbox(${LOGGED_USER.id})" class="toggleCheckbox"></div>
      <label class="nameOfContact">You</label>
      <input id="checkBoxUser${LOGGED_USER.id}" type="checkbox"/>
    </li>
  `;
}

/**
 * Toggles the state of the checkbox with the given id and updates the title to show the number of selected contacts.
 *
 * @param {string} id - The id of the checkbox to toggle.
 */
function toggleCheckbox(id) {
  const checkbox = document.getElementById(`checkBoxUser${id}`);
  checkbox.checked = !checkbox.checked;
  changeTitleContactInput();
}

/**
 * Updates the title to show the number of selected contacts.
 */
function changeTitleContactInput() {
  const selectedCheckBoxes = document.querySelectorAll(
    '#listContacts input[type="checkbox"]:checked'
  );
  const selectContactsTitle = document.getElementById("selectContactsTitle");
  if (selectedCheckBoxes.length === 0) {
    selectContactsTitle.innerHTML = "Select contacts to assign";
  } else if (selectedCheckBoxes.length === 1) {
    selectContactsTitle.innerHTML = "1 Contact selected";
  } else {
    selectContactsTitle.innerHTML = `${selectedCheckBoxes.length} Contacts selected`;
  }
}

/*PRIO BUTTONS*******************************************************************************/

/**
 * Changes the style of the clicked button and deselects the previously selected button.
 * @param {string} id - The id of the clicked button.
 * @param {string} backgroundColor - The background color to apply to the clicked button.
 */
function changeStylePrioBtn(id, backgroundColor) {
  const btns = document.querySelectorAll(".singlePrioBtn");
  const currentBtn = document.getElementById(id);
  const currentImg = currentBtn.querySelector("img");

  if (SELECTED_PRIO_BTN !== currentBtn) {
    selectBtn(currentBtn, backgroundColor, currentImg);
    deselectBtn(SELECTED_PRIO_BTN);
    SELECTED_PRIO_BTN = currentBtn;
  }
  updateHoverEffect(btns, currentBtn);
}

/**
 * Selects the provided button and updates its style and image.
 * @param {HTMLElement} currentBtn - The button element to select.
 * @param {string} backgroundColor - The background color to apply to the button.
 * @param {HTMLImageElement} img - The image element within the button.
 */
function selectBtn(currentBtn, backgroundColor, img) {
  currentBtn.style.backgroundColor = backgroundColor;
  currentBtn.style.color = "white";
  img.src = img.src.replace(".svg", "White.svg");
}

/**
 * Deselects the provided button and updates its style and image.
 * @param {HTMLElement} btn - The button element to deselect.
 */
function deselectBtn(SELECTED_PRIO_BTN) {
  if (SELECTED_PRIO_BTN) {
    const img = SELECTED_PRIO_BTN.querySelector("img");
    SELECTED_PRIO_BTN.style.backgroundColor = "";
    SELECTED_PRIO_BTN.style.color = "";
    img.src = img.src.replace("White.svg", ".svg");
  }
}

/**
 * Updates the hover effect for a group of buttons.
 *
 * @param {<HTMLElement>} btns - An array of button elements to update the hover effect for.
 * @param {Element} hoveredBtn - The currently hovered button element.
 * @param {string} backgroundColor - The background color to apply to the selected button.
 */
function updateHoverEffect(btns, currentBtn) {
  btns.forEach((btn) => {
    if (btn === currentBtn) {
      btn.classList.add("selectedPrioBtn");
    } else {
      btn.classList.remove("selectedPrioBtn");
    }
  });
}

/*SUBTASKS*******************************************************************************/

function addSubtask() {
  let subtask = addTaskSubtasks.value;
  if (subtask) {
    SUBTASKS.push(subtask);
    document.getElementById("addTaskSubtasks").value = "";
    renderSubtasks();
  }
}

function renderSubtasks() {
  document.getElementById("subtasks").innerHTML = "";
  SUBTASKS.forEach((subtask) => {
    let indexOfSubtask = SUBTASKS.indexOf(subtask);
    document.getElementById("subtasks").innerHTML += renderSubtasksHtml(
      subtask,
      indexOfSubtask
    );
  });
}

function renderSubtasksHtml(subtask, indexOfSubtask) {
  return /*html*/ `
    <div class="singleSubtask">
      <input type="checkbox" id="" class="checkbox">
      <span class='subtask'>${subtask}</span>
    </div>
  `;
}

function createTask() {
  let task = {
    title: getTitle(),
    description: getDescription(),
    category: getCategory(),
    contacts: getSelectedCheckBoxes(),
    dueDate: getDueDate(),
    priority: getPriority(),
    subtasks: SUBTASKS,
    processStep: "todo",
  };
  checkAndPushTask(task);
}

function checkAndPushTask(task) {
  if (requiredDataComplete(task)) {
    TASKS.push(task);
    setItem("tasks", JSON.stringify(TASKS));
  }
}

function requiredDataComplete(task) {
  return (
    task.title !== undefined &&
    task.description !== undefined &&
    task.category !== undefined &&
    task.contacts !== undefined &&
    task.dueDate !== undefined &&
    task.priority !== undefined
  );
}

function getTitle() {
  if (titleInput.value) {
    hideError("errorTitle");
    return titleInput.value;
  } else {
    showError("errorTitle");
    return undefined;
  }
}

function getDescription() {
  if (descriptionInput.value) {
    hideError("errorDescription");
    return descriptionInput.value;
  } else {
    showError("errorDescription");
    return undefined;
  }
}

function getCategory() {
  let cateGoryName = document.getElementById("selectedCategoryName");
  if (cateGoryName) {
    hideError("errorCategory");
    return cateGoryName.innerHTML;
  } else {
    showError("errorCategory");
    return undefined;
  }
}

function getDueDate() {
  if (inputDueDate.value) {
    hideError("errorDueDate");
    return inputDueDate.value;
  } else {
    showError("errorDueDate");
    return undefined;
  }
}

function getPriority() {
  let priority = document.querySelector(".selectedPrioBtn");
  if (priority) {
    hideError("errorPriority");
    return priority.getAttribute("id");
  } else {
    showError("errorPriority");
    return undefined;
  }
}

function hideError(id) {
  const errorElement = document.getElementById(id);
  if (!errorElement.classList.contains("d-none")) {
    errorElement.classList.add("d-none");
  }
}

/**
 * Checks if a value is undefined and removes the "d-none" class from an element with the ID "error" + the variable name if it is.
 *
 * @param {string} id - The name of the variable to check.
 */
function showError(id) {
  const errorElement = document.getElementById(id);
  errorElement.classList.remove("d-none");
}

/**
 * Retrieves an array of numbers representing the ids of checked selectedCheckBoxes within the "savedContacts" container.
 *
 * @return {Array} An array of numbers representing the ids of checked selectedCheckBoxes within the "savedContacts" container.
 */
function getSelectedCheckBoxes() {
  const selectedCheckBoxes = document.querySelectorAll(
    '#listContacts input[type="checkbox"]:checked'
  );
  if (selectedCheckBoxes.length > 0) {
    hideError("errorContacts");
    return getContactsId(selectedCheckBoxes);
  } else {
    showError("errorContacts");
    return undefined;
  }
}

function getContactsId(selectedCheckBoxes) {
  const checkedIds = [];
  selectedCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedIds.push(Number(checkbox.id.replace("checkBoxUser", "")));
    }
  });
  console.log("checkedIds", checkedIds);
  return checkedIds;
}

/**
 * Retrieves the text content of all elements with the class "subtask".
 * @returns {Array<string>} An array of the text content of elements with the class "subtask".
 */
function getSubtasks() {
  const subtaskElements = document.querySelectorAll(".subtask");
  const subtaskTexts = [];
  subtaskElements.forEach((element) => {
    subtaskTexts.push(element.textContent.trim());
  });
  return subtaskTexts;
}

function clearTask() {
  titleInput.value = "";
  descriptionInput.value = "";
  document.getElementById("selectCategoryTitle").innerHTML =
    "Select task category";
  document.getElementById("selectContactsTitle").innerHTML =
    "Select contacts to assign";
  document.getElementById("inputDueDate").value = "";
  clearPrioBtn();
  clearSubtasks();
}

function clearPrioBtn() {
  if (SELECTED_PRIO_BTN) {
    deselectBtn(SELECTED_PRIO_BTN);
    SELECTED_PRIO_BTN.classList.remove("selectedPrioBtn");
  }
}

function clearSubtasks() {
  SUBTASKS = [];
  document.getElementById("subtasks").innerHTML = "";
  document.getElementById("addTaskSubtasks").value = "";
}

/*CATEGORY*/

function toggleNewCategory() {
  toggleClass("selectCategory", "d-none");
  toggleClass("newCategory", "d-none");
  toggleClass("categorysColours", "d-none");
}

function showSelectCategory() {
  toggleNewCategory();
  toggleClass("listCategorys", "d-none");
}

/*CONTACTS*/

function toggleInviteContact() {
  toggleClass("newContact", "d-none");
  toggleClass("selectContact", "d-none");
}

function showSelectContacts() {
  toggleInviteContact();
  toggleClass("listContacts", "d-none");
}
