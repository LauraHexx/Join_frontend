let SELECTED_PRIO_BTN;
let SUBTASKS = [];

async function initAddTask() {
  await loadUserData();
  await getLoggedUser();
  await init("addTask");
  setContactsAndCategorysDropDownMenu();
  setEventCloseDropDown();
}

function setContactsAndCategorysDropDownMenu() {
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
    <li onclick="setSelectedCategory('${name}','${color}')" class="singleCategory">
      <span>${name}</span>
      <div class="circle ${color}"></div>
    </li>
  `;
}

function setSelectedCategory(name, color) {
  const selectCategoryTitle = document.getElementById("selectCategoryTitle");
  selectCategoryTitle.innerHTML = /*html*/ `
    <li class="selectedCategory">
      <span id='selectedCategoryName'>${name}</span>
      <div class="${color} circle colorOfCategory"></div>
    </li>
  `;
}

async function addNewCategory() {
  let newCategory = getNewCategory();
  let colour = getSelectedColor();
  checkAndPushCategory(newCategory, colour);
  await setItem("users", JSON.stringify(USERS));
  setContactsAndCategorysDropDownMenu();
}

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

function noCategoryNameEntered(newCategory) {
  return newCategory === "";
}

function setErrorsNoCategoryEntered() {
  showError("errorNewCategoryNoNameEntered");
  hideError("errorNoCategorySelected");
  hideError("errorNewCategoryNameAlreadyExists");
}

function categoryNameAlreadyExists(newCategory) {
  return CATEGORYS.find((category) => category.name === newCategory);
}

function setErrorsCategoryAlreadyExists() {
  showError("errorNewCategoryNameAlreadyExists");
  hideError("errorNoCategorySelected");
  hideError("errorNewCategoryNoNameEntered");
}

function getSelectedColor() {
  const selectedColor = document.querySelector(".selectedColor");
  console.log(selectedColor);
  if (selectedColor) {
    deleteColorError(selectedColor);
    return selectedColor.id;
  } else {
    showErrorNoColorSelected();
    return;
  }
}

function deleteColorError() {
  hideError("errorNewCategoryNoColorSelected");
}

function showErrorNoColorSelected() {
  showError("errorNewCategoryNoColorSelected");
}

async function checkAndPushCategory(newCategory, color) {
  if (newCategory && color) {
    let indexUserToAddCategory = USERS.indexOf(LOGGED_USER);
    let userToAddCategory = USERS[indexUserToAddCategory];
    userToAddCategory.categorys.push({
      name: newCategory,
      color: color,
    });
    changeStyleCategory();
    deleteAllErrors();
    resetNewCategory();
    setSelectedCategory(newCategory, color);
  }
}

function deleteAllErrors() {
  hideError("errorNewCategoryNoNameEntered");
  hideError("errorNewCategoryNameAlreadyExists");
}

function changeStyleCategory() {
  toggleClass("selectCategoryDiv", "d-none");
  toggleClass("newCategoryDiv", "d-none");
  toggleClass("newCategoryColorSelection", "d-none");
}

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

function moveSelectedColorCircleDown() {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    circle.classList.remove("selectedColor");
  });
}

/*CONTACTS******************************************************************************/

function renderContacts() {
  if (LOGGED_USER.name == "Guest") {
    document.getElementById("loggedUserContact").classList.add("d-none");
  }
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

function renderContactsHtml(name, id) {
  return /*html*/ `
    <li class="oneContact" onclick="event.stopPropagation();">
      <div onclick="toggleCheckbox(${id})" class="toggleCheckbox"></div>
      <label class="nameOfContact">${name}</label>
      <input id="checkBoxUser${id}" type="checkbox"/>
    </li>
  `;
}

function toggleCheckbox(id) {
  const checkbox = document.getElementById(`checkBoxUser${id}`);
  checkbox.checked = !checkbox.checked;
  changeTitleContactInput();
}

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
    SUBTASKS.push({
      name: subtask,
      status: "undone",
    });
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
      <span class='subtask'>${subtask.name}</span>
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

async function checkAndPushTask(task) {
  if (requiredDataComplete(task)) {
    let indexUserToAddTask = USERS.indexOf(LOGGED_USER);
    let userToAddTask = USERS[indexUserToAddTask];
    userToAddTask.tasks.push(task);
    await setItem("users", JSON.stringify(USERS));
    loadTemplate("./board.html");
  }
}

function requiredDataComplete(task) {
  return (
    task.title !== undefined &&
    task.description !== undefined &&
    task.category !== undefined &&
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
    hideError("errorNoCategorySelected");
    return cateGoryName.innerHTML;
  } else {
    showError("errorNoCategorySelected");
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
  titleInput.value = "";
  descriptionInput.value = "";
  document.getElementById("selectCategoryTitle").innerHTML =
    "Select task category";
  document.getElementById("selectContactsTitle").innerHTML =
    "Select contacts to assign";
  document.getElementById("inputDueDate").value = "";
  clearPrioBtn();
  clearSubtasks();
  hideErrorElements();
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

function resetNewCategory() {
  moveSelectedColorCircleDown();
  hideError("errorNewCategoryNoNameEntered");
  hideError("errorNewCategoryNoColorSelected");
  document.getElementById("newCategoryInput").value = "";
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

// Event listener for closing the dropdown menus
function setEventCloseDropDown() {
  closeDropDown();
  toggleCategoryDropDownContainer();
  toggleContactDropDownContainer();
}

function closeDropDown() {
  document.addEventListener("click", handleClickOnPage);

  function handleClickOnPage(event) {
    if (
      !event.target.closest("#listContacts") &&
      !event.target.closest("#selectContactsDiv")
    ) {
      hideDropdown("listContacts");
      hideDropdown("listCategorys");
    }
  }
}

function hideDropdown(id) {
  let dropDownList = document.getElementById(id);
  dropDownList.classList.add("d-none");
}

function toggleCategoryDropDownContainer() {
  document
    .getElementById("selectCategoryDiv")
    .addEventListener("click", handleClick);

  function handleClick(event) {
    event.stopPropagation();
    toggleClass("listCategorys", "d-none");
    hideDropdown("listContacts");
  }
}

/**
 * Toggles the visibility of the contact dropdown menu.
 */
function toggleContactDropDownContainer() {
  document
    .getElementById("selectContactsDiv")
    .addEventListener("click", handleClick);

  /**
   * Handles the click event on the contact dropdown container.
   * @param {Event} event - The click event object.
   */
  function handleClick(event) {
    event.stopPropagation();
    toggleClass("listContacts", "d-none");
  }
}

function closeAddTask() {
  toggleClass("body", "overflowHidden");
  showDisplay("contentAddTaskDisplay", "animation-slideInRight", "d-none");
  clearTask();
}
