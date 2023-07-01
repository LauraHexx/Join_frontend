let SELECTED_PRIO_BTN;
let SUBTASKS = [];

async function initAddTask() {
  await setNavAndHeader("addTask");
  await loadDataAndRenderDropDown();
  setEventsAddTask();
}

/**
 * Loads user data and renders the drop down menues.
 * Displays a loading image during the loading time.
 * @async
 */
async function loadDataAndRenderDropDown() {
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  await getLoggedUser();
  await renderDropDownAddTaskDisplay();
  toggleClass("loadingContainer", "d-none");
}

/**
 * Sets event listeners for the add task page.
 */
function setEventsAddTask() {
  setEventListenerHoverBtn();
  setEventCloseDropDown();
}

/*RENDER DATA DROP DOWN - CATEGORY + CONTACTS***********************************************************/

/**
 * It retrieves the contacts and categories associated with the logged-in user and sorts it alphabetically.
 * It´s responsible for setting up the initial state of the dropdown menus
 */
function renderDropDownAddTaskDisplay() {
  CONTACTS = LOGGED_USER.contacts;
  CATEGORYS = LOGGED_USER.categorys;
  if (CATEGORYS) {
    sortArrayAlphabetically(CATEGORYS);
    renderCategorys();
  }
  if (CONTACTS) {
    sortArrayAlphabetically(CONTACTS);
    renderContacts();
  }
}

/**
 * Renders the categories in drop down menu.
 */
function renderCategorys() {
  document.getElementById("selectableCategorys").innerHTML = "";
  CATEGORYS.forEach((category) => {
    const name = category.name;
    const color = category.color;
    document.getElementById("selectableCategorys").innerHTML +=
      renderCategorysHtml(name, color);
  });
}

/**
 * Renders the selected category when clicking on one.
 * @param {string} name - The name of the category.
 * @param {string} color - The color of the category.
 */
function renderSelectedCategory(name, color) {
  const selectCategoryTitle = document.getElementById("selectCategoryTitle");
  selectCategoryTitle.innerHTML = renderSelectedCategoryHtml(name, color);
}

/**
 * Adds a new category to select.
 * @async
 */
async function addNewCategory() {
  let newCategory = getNewCategory();
  let colour = getSelectedColor();
  checkDataAndDisplayNewCategory(newCategory, colour);

  renderDropDownAddTaskDisplay();
}

/**
 * Retrieves the value of the new category input or an error if no value entered.
 * @returns {string | undefined} The new category value, or undefined if no value is entered or if the category name already exists.
 */
function getNewCategory() {
  let newCategory = document.getElementById("newCategoryInput").value;
  if (noCategoryNameEntered(newCategory)) {
    setErrorsNoCategoryEntered();
    newCategory = undefined;
  }
  if (categoryNameAlreadyExists(newCategory)) {
    setErrorsCategoryAlreadyExists();
    newCategory = undefined;
  }
  return newCategory;
}

/**
 * Retrieves the value of the new category input.
 * @returns {string | undefined} The new category name, or undefined if no value is entered or if the category name already exists.
 */
function noCategoryNameEntered(newCategory) {
  return newCategory === "";
}

/**
 * Sets error messages for not entering a category name.
 */
function setErrorsNoCategoryEntered() {
  showError("errorNewCategoryNoNameEntered");
  hideError("errorNoCategorySelected");
  hideError("errorNewCategoryNameAlreadyExists");
}

/**
 * Checks if the category name already exists.
 * @param {string} newCategory - The new category value.
 * @returns {boolean} True if the category name already exists, false otherwise.
 */
function categoryNameAlreadyExists(newCategory) {
  return CATEGORYS.find((category) => category.name === newCategory);
}

/**
 * Sets error messages for the category name already existing.
 */
function setErrorsCategoryAlreadyExists() {
  showError("errorNewCategoryNameAlreadyExists");
  hideError("errorNoCategorySelected");
  hideError("errorNewCategoryNoNameEntered");
}

/**
 * Retrieves the selected color.
 * @returns {string | undefined} The ID of the selected color, or undefined if no color is selected.
 */
function getSelectedColor() {
  const selectedColor = document.querySelector(".selectedColor");
  if (selectedColor) {
    hideError("errorNewCategoryNoColorSelected");
    return selectedColor.id;
  } else {
    showError("errorNewCategoryNoColorSelected");
    return;
  }
}

/**
 * Initializes the process of checking if the data for a new category is complete, pushes the new category to the user, and displays it.
 * @param {string} newCategory - The name of the new category.
 * @param {string} color - The color of the new category.
 * @async
 */
async function checkDataAndDisplayNewCategory(newCategory, color) {
  if (requiredDataNewCategoryComplete(newCategory, color)) {
    pushNewCategoryToUser(newCategory, color);
    await setItem("users", JSON.stringify(USERS));
    resetNewCategory();
    renderSelectedCategory(newCategory, color);
    changeStyleCategory();
    deleteAllErrors();
  }
}

/**
 * Checks if the required data for a new category is complete.
 * @returns {boolean} - Returns true if both newCategory and color are defined, false otherwise.
 */
function requiredDataNewCategoryComplete(newCategory, color) {
  return newCategory && color;
}

/**
 * Adds a new category to the current user.
 * @param {string} newCategory - The name of the new category.
 * @param {string} color - The color of the new category.
 */
function pushNewCategoryToUser(newCategory, color) {
  let indexUserToAddCategory = USERS.indexOf(LOGGED_USER);
  let userToAddCategory = USERS[indexUserToAddCategory];
  userToAddCategory.categorys.push({
    name: newCategory,
    color: color,
  });
}

/**
 * Resets the new category by moving the selected color circle down, hiding specific error messages, and clearing the new category input.
 */
function resetNewCategory() {
  moveSelectedColorCircleDown();
  hideError("errorNewCategoryNoNameEntered");
  hideError("errorNewCategoryNoColorSelected");
  document.getElementById("newCategoryInput").value = "";
}

/**
 * Changes the style of the category elements.
 */
function changeStyleCategory() {
  toggleClass("selectCategoryDiv", "d-none");
  toggleClass("newCategoryDiv", "d-none");
  toggleClass("newCategoryColorSelection", "d-none");
}

/**
 * Deletes all error messages related to the new category.
 */
function deleteAllErrors() {
  hideError("errorNewCategoryNoNameEntered");
  hideError("errorNewCategoryNameAlreadyExists");
}

/**
 * Moves the selected color circle up by removing the "selectedColor" class from all circles.
 */
function moveSelectedColorCircleUp(event) {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    if (circle === event.target) {
      circle.classList.add("selectedColor");
    } else {
      circle.classList.remove("selectedColor");
    }
  });
}

/**
 * Moves color circle down by removing the "selectedColor" class from all circles.
 */
function moveSelectedColorCircleDown() {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    circle.classList.remove("selectedColor");
  });
}

/*CONTACTS******************************************************************************/

function renderContacts() {
  if (loggedUserIsGuest()) {
    dontShowYouContact();
  }
  renderSavedContacts();
}

function loggedUserIsGuest() {
  return LOGGED_USER.name == "Guest";
}

function dontShowYouContact() {
  document.getElementById("loggedUserContact").classList.add("d-none");
}

function renderSavedContacts() {
  document.getElementById("savedContacts").innerHTML = "";
  CONTACTS.forEach((contact) => {
    const name = contact.name;
    const id = contact.id;
    document.getElementById("savedContacts").innerHTML += renderContactsHtml(
      name,
      id
    );
  });
}

function toggleCheckbox(id) {
  const checkbox = document.getElementById(`checkBoxUser${id}`);
  checkbox.checked = !checkbox.checked;
  changeTitleContactInput();
}

function changeTitleContactInput() {
  let selectedCheckboxes = getSelectedCheckboxes();
  let amountSelectedContacts = selectedCheckboxes.length;
  const selectContactsTitle = document.getElementById("selectContactsTitle");
  if (noContactsSelected(amountSelectedContacts)) {
    selectContactsTitle.innerHTML = "Select contacts to assign";
  } else if (oneContactSelected(amountSelectedContacts)) {
    selectContactsTitle.innerHTML = "1 Contact selected";
  } else {
    selectContactsTitle.innerHTML = `${amountSelectedContacts} Contacts selected`;
  }
}

function getSelectedCheckboxes() {
  return document.querySelectorAll(
    '#listContacts input[type="checkbox"]:checked'
  );
}

function noContactsSelected(amountSelectedContacts) {
  return amountSelectedContacts === 0;
}

function oneContactSelected(amountSelectedContacts) {
  return amountSelectedContacts === 1;
}

/*PRIO BUTTONS*******************************************************************************/

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

function selectBtn(currentBtn, backgroundColor, img) {
  currentBtn.style.backgroundColor = backgroundColor;
  currentBtn.style.color = "white";
  img.src = img.src.replace(".svg", "White.svg");
}

function deselectBtn(SELECTED_PRIO_BTN) {
  if (SELECTED_PRIO_BTN) {
    const img = SELECTED_PRIO_BTN.querySelector("img");
    SELECTED_PRIO_BTN.style.backgroundColor = "";
    SELECTED_PRIO_BTN.style.color = "";
    img.src = img.src.replace("White.svg", ".svg");
  }
}

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
  const subtask = addTaskSubtasks.value;
  if (subtask) {
    SUBTASKS.push({
      name: subtask,
      status: "unchecked",
    });
    document.getElementById("addTaskSubtasks").value = "";
    renderSubtasks();
  }
}

function renderSubtasks() {
  document.getElementById("subtasks").innerHTML = "";
  SUBTASKS.forEach((subtask) => {
    const indexOfSubtask = SUBTASKS.indexOf(subtask);
    const status = subtask.status;
    document.getElementById("subtasks").innerHTML += renderSubtasksHtml(
      subtask,
      indexOfSubtask,
      status
    );
  });
}

function setStatusCheckbox(indexOfSubtask) {
  const checkbox = document.getElementById(`subtask${indexOfSubtask}`);
  let status;
  if (checkbox.checked) {
    status = "checked";
  } else {
    status = "unchecked";
  }
  SUBTASKS[indexOfSubtask].status = status;
}

function createTask() {
  let task = {
    title: getDataFromInput("titleInput", "errorTitle"),
    description: getDataFromInput("descriptionInput", "errorDescription"),
    category: getCategory(),
    contacts: getSelectedCheckBoxes(),
    dueDate: getDataFromInput("inputDueDate", "errorDueDate"),
    priority: getPriority(),
    subtasks: SUBTASKS,
    processStep: "todo",
  };
  checkAndPushTask(task);
}

async function checkAndPushTask(task) {
  if (requiredDataTaskComplete(task)) {
    let indexUserToAddTask = USERS.indexOf(LOGGED_USER);
    let userToAddTask = USERS[indexUserToAddTask];
    userToAddTask.tasks.push(task);
    await setItem("users", JSON.stringify(USERS));
    loadTemplate("./board.html");
  }
}

function requiredDataTaskComplete(task) {
  return (
    task.title !== undefined &&
    task.description !== undefined &&
    task.category !== undefined &&
    task.dueDate !== undefined &&
    task.priority !== undefined
  );
}

function getCategory() {
  const cateGoryName = document.getElementById("selectedCategoryName");
  if (cateGoryName) {
    hideError("errorNoCategorySelected");
    return cateGoryName.innerHTML;
  } else {
    showError("errorNoCategorySelected");
    return undefined;
  }
}

function getPriority() {
  const priority = document.querySelector(".selectedPrioBtn");
  if (priority) {
    hideError("errorPriority");
    return priority.getAttribute("id");
  } else {
    showError("errorPriority");
    return undefined;
  }
}

function getSelectedCheckBoxes() {
  const selectedCheckBoxes = document.querySelectorAll(
    '#listContacts input[type="checkbox"]:checked'
  );
  if (selectedCheckBoxes.length > 0) {
    return getContactsId(selectedCheckBoxes);
  } else {
    return [];
  }
}

function getContactsId(selectedCheckBoxes) {
  const checkedBoxesId = [];
  selectedCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedBoxesId.push(Number(checkbox.id.replace("checkBoxUser", "")));
    }
  });
  return checkedBoxesId;
}

function getSubtasks() {
  const subtaskElements = document.querySelectorAll(".subtask");
  const subtaskTexts = [];
  subtaskElements.forEach((element) => {
    subtaskTexts.push(element.textContent.trim());
  });
  return subtaskTexts;
}

function clearTask() {
  document.getElementById("titleInput").value = "";
  document.getElementById("descriptionInput").value = "";
  document.getElementById("selectCategoryTitle").innerHTML =
    "Select task category";
  document.getElementById("selectContactsTitle").innerHTML =
    "Select contacts to assign";
  clearCheckedContacts();
  document.getElementById("inputDueDate").value = "";
  clearPrioBtn();
  clearSubtasks();
  hideErrorElements();
}

function clearCheckedContacts() {
  const checkboxes = document.querySelectorAll(
    '.listDropDown input[type="checkbox"]'
  );
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
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

function hideErrorElements() {
  const mainContainer = document.getElementsByClassName("mainContainer")[0];
  const elements = mainContainer.querySelectorAll('[id*="error"]');
  elements.forEach((element) => {
    element.classList.add("d-none");
  });
}

/*CATEGORY*/

function toggleNewCategory() {
  toggleClass("selectCategoryDiv", "d-none");
  toggleClass("newCategoryDiv", "d-none");
  toggleClass("newCategoryColorSelection", "d-none");
}

function stopAddingNewCategory() {
  resetNewCategory();
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

function closeAddTask() {
  toggleClass("body", "overflowHidden");
  hideDisplay("contentAddTaskDisplay", "d-none");
  clearTask();
  document.getElementById("clearBtn").classList.remove("d-none");
  document.getElementById("createBtn").classList.remove("d-none");
  document.getElementById("editBtn").classList.add("d-none");
}
