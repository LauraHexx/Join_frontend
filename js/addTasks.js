let SELECTED_PRIO_BTN;
let SUBTASKS = [];
let CLICKED_PROCESS_STEP;
let CLICKED_CONTACTS = [];

/**
 * Sets the navigation and header for the add task page, loads data and sets the contacts and categories drop-down menu in the add task display.
 * @async
 */
async function initAddTask() {
  checkIfUserIsLogged();
  await setNavAndHeader("addTask");
  await loadDataAndRenderDropDown();
  setProcessStepForNewTask("todo");
  setEventsAddTask();
}

/**
 * Loads user data and renders the drop down menues.
 * Displays a loading image during the loading time.
 * @async
 */
async function loadDataAndRenderDropDown() {
  toggleClass("loadingContainer", "d-none");
  await getDropDownData();
  await renderDropDownAddTaskDisplay();
  toggleClass("loadingContainer", "d-none");
}

async function getDropDownData() {
  await getContacts();
  await getCategories();
}

/**
 * Sets event listeners for the add task page.
 */
function setEventsAddTask() {
  setEventListenerHoverBtn();
  setEventCloseDropDown();
}

/*CATEGORYS + CONTACTS***********************************************************/

/**
 * It retrieves the contacts and categories associated with the logged-in user and sorts it alphabetically.
 * It´s responsible for setting up the initial state of the dropdown menus
 */
function renderDropDownAddTaskDisplay() {
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
 * Renders the contacts based on the logged-in user status.
 * If the logged-in user is a guest, it hides the user's own contact.
 * Renders all saved contacts.
 */
function renderContacts() {
  if (loggedUserIsNotGuest()) {
    showYouContact();
  }
  renderSavedContacts();
}

/**
 * Checks if the logged-in user is a guest.
 * @returns {boolean} True if the logged-in user is a guest, otherwise false.
 */
function loggedUserIsNotGuest() {
  return !LOGGED_USER.name.includes("Guest");
}

function showYouContact() {
  document.getElementById("savedContacts").innerHTML = "";
  const loggedUser = CONTACTS.find(
    (contact) => contact.email === LOGGED_USER.email
  );
  const id = loggedUser.id;
  const color = loggedUser.color;
  document.getElementById("savedContacts").innerHTML += renderYouContactHtml(
    LOGGED_USER.name,
    id,
    color
  );
}

/**
 * Hides the logged-in user's contact by adding the 'd-none' class to it.
 */
function dontShowYouContact() {
  document.getElementById("loggedUserContact").classList.add("d-none");
}

/**
 * Renders all contacts of the user.
 */
function renderSavedContacts() {
  CONTACTS.forEach((contact) => {
    if (isNotUserContact(contact)) {
      const name = contact.name;
      const id = contact.id;
      const color = contact.color;
      document.getElementById("savedContacts").innerHTML += renderContactsHtml(
        name,
        id,
        color
      );
    }
  });
}

/**
 * Checks whether a given contact is not the currently logged-in user.
 * @param {Object} contact - The contact object to check.
 * @param {string} contact.email - The email of the contact.
 * @returns {boolean} - Returns true if the contact is not the logged-in user, otherwise false.
 */
function isNotUserContact(contact) {
  return contact.email !== LOGGED_USER.email;
}

/**
 * Toggles the checkbox state and initializes the display of clicked contacts.
 * @param {string} id - The ID of the checkbox to toggle.
 */
function toggleCheckbox(id) {
  const checkbox = document.getElementById(`checkBoxUser${id}`);
  checkbox.checked = !checkbox.checked;
  let selectedCheckboxes = getSelectedCheckboxes();
  let amountSelectedContacts = selectedCheckboxes.length;
  addOrRemoveContactToArray(checkbox, id);
  renderTwoClickedContacts(id, checkbox, amountSelectedContacts);
  renderRestAmountClickedContacts(amountSelectedContacts);
  changeTitleContactInput(amountSelectedContacts);
}

/**
 * Adds or removes the contact ID from the CLICKED_CONTACTS array based on the checkbox state.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 * @param {string} id - The ID of the contact.
 */
function addOrRemoveContactToArray(checkbox, id) {
  if (checkbox.checked) {
    CLICKED_CONTACTS.push(id);
  } else {
    const index = CLICKED_CONTACTS.indexOf(id);
    CLICKED_CONTACTS.splice(index, 1);
  }
}

/**
 * Renders the two clicked contacts.
 * @param {string} id - The ID of the clicked contact.
 * @param {HTMLInputElement} checkbox - The checkbox element of the clicked contact.
 * @param {number} amountSelectedContacts - The total number of clicked contacts.
 */
function renderTwoClickedContacts(id, checkbox, amountSelectedContacts) {
  const container = document.getElementById("clickedContacts");
  container.innerHTML = CLICKED_CONTACTS.slice(0, 2)
    .map(getRenderedContactHtml)
    .filter(Boolean)
    .join("");
}

/**
 * Generates the HTML for a clicked contact if valid.
 * @param {string} contactId - The ID of the contact to render.
 * @returns {string|null} The HTML string for the contact or null if the ID is invalid.
 */
function getRenderedContactHtml(contactId) {
  if (!contactId) return null;
  const contact = getContactData(contactId);
  if (contact.email === LOGGED_USER.email) {
    return renderTwoClickedContactsHtml(contact, "You");
  }
  const initials = getInitials(contact.name);
  return renderTwoClickedContactsHtml(contact, initials);
}

/**
 * Renders the remaining amount of clicked contacts.
 * @param {number} amountSelectedContacts - The total number of clicked contacts.
 */
function renderRestAmountClickedContacts(amountSelectedContacts) {
  document.getElementById("restAmountContacts").innerHTML = "";
  if (CLICKED_CONTACTS.length > 2) {
    const furtherAmountOfContacts = amountSelectedContacts - 2;
    document.getElementById("restAmountContacts").innerHTML =
      renderRestAmountClickedContactsHtml(furtherAmountOfContacts);
  }
}

/**
 * Changes the title of the contact input based on the number of clicked contacts.
 * @param {number} amountSelectedContacts - The total number of clicked contacts.
 */
function changeTitleContactInput(amountSelectedContacts) {
  const selectContactsTitle = document.getElementById("selectContactsTitle");
  if (noContactsSelected(amountSelectedContacts)) {
    selectContactsTitle.innerHTML = "Select contacts to assign";
  } else if (oneContactSelected(amountSelectedContacts)) {
    selectContactsTitle.innerHTML = "1 Contact selected";
  } else {
    selectContactsTitle.innerHTML = `${amountSelectedContacts} Contacts selected`;
  }
}

/**
 * Retrieves all selected checkboxes in the 'listContacts' element.
 * @returns {NodeList} A NodeList containing all selected checkboxes.
 */
function getSelectedCheckboxes() {
  return document.querySelectorAll(
    '#listContacts input[type="checkbox"]:checked'
  );
}

/**
 * Checks if no contacts are selected.
 * @param {number} amountSelectedContacts - The number of selected contacts.
 * @returns {boolean} True if no contacts are selected, otherwise false.
 */
function noContactsSelected(amountSelectedContacts) {
  return amountSelectedContacts === 0;
}

/**
 * Checks if only one contact is selected.
 * @param {number} amountSelectedContacts - The number of selected contacts.
 * @returns {boolean} True if only one contact is selected, otherwise false.
 */
function oneContactSelected(amountSelectedContacts) {
  return amountSelectedContacts === 1;
}

/*CREATE NEW TASK*****************************************************************/

function openAddTask(processStep) {
  showDisplay("contentAddTaskDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
  setProcessStepForNewTask(processStep);
}

function setProcessStepForNewTask(processStep) {
  if (processStep) {
    CLICKED_PROCESS_STEP = processStep;
  } else {
    CLICKED_PROCESS_STEP = "todo";
  }
}

/**
 * Creates a task object with the provided data and initialize pushing it to the user's task list.
 */
function createTask() {
  let task = {
    title: getDataFromInput("titleInput", "errorTitle"),
    description: getDataFromInput("descriptionInput", "errorDescription"),
    category_id: getCategoryId(),
    contact_ids: getSelectedCheckBoxes(),
    due_date: getDataFromInput("inputDueDate", "errorDueDate"),
    priority: getPriority(),
    subtasks: SUBTASKS,
    process_step: CLICKED_PROCESS_STEP,
  };
  checkAndPushTask(task);
}

/**
 * Retrieves the selected category ID based on the selected category name,
 * or displays an error if no category is selected.
 * @returns {number|undefined} - Returns the category ID or undefined if no category is selected or found.
 */
function getCategoryId() {
  const categoryNameEl = document.getElementById("selectedCategoryName");
  if (categoryNameEl) {
    hideError("errorNoCategorySelected");
    const categoryName = categoryNameEl.innerHTML;
    const category = CATEGORYS.find((cat) => cat.name === categoryName);
    return category?.id;
  } else {
    showError("errorNoCategorySelected");
    return undefined;
  }
}

/**
 * Retrieves the IDs of the selected checkboxes/contacts.
 * @returns {number[]} An array of contact IDs.
 */
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

/**
 * Retrieves the IDs of the contacts associated with the selected checkboxes.
 * @param {NodeList} selectedCheckBoxes - The selected checkboxes.
 * @returns {number[]} An array of contact IDs.
 */
function getContactsId(selectedCheckBoxes) {
  const checkedBoxesId = [];
  selectedCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedBoxesId.push(Number(checkbox.id.replace("checkBoxUser", "")));
    }
  });
  return checkedBoxesId;
}

/**
 * Retrieves the priority of a task diplays and error if no priority selected.
 * @returns {string|undefined} The priority ID if a priority is selected, otherwise undefined.
 */
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

/**
 * Checks if the required data for a task is complete and pushes the task to the user's task list if so.
 * After pushing the task, loads "board" page.
 * @param {object} task - The task object to be checked and pushed.
 * @returns {boolean} - Returns true if the required data for the task is complete, otherwise false.
 */
async function checkAndPushTask(task) {
  if (requiredDataTaskComplete(task)) {
    await addTask(task);
    loadTemplate("board.html");
  }
}

/**
 * Checks if the required data for a task is complete.
 * @param {object} task - The task object to be checked.
 * @returns {boolean} - Returns true if the required data for the task is complete, otherwise false.
 */
function requiredDataTaskComplete(task) {
  return (
    task.title !== undefined &&
    task.description !== undefined &&
    task.category_id !== undefined &&
    task.due_date !== undefined &&
    task.priority !== undefined
  );
}

/*CLEAR ALL SELECTIONS**********************************************************************/

/**
 * Clears the task inputs, selections, and error elements.
 */
function clearTask() {
  document.getElementById("titleInput").value = "";
  document.getElementById("descriptionInput").value = "";
  document.getElementById("selectCategoryTitle").innerHTML =
    "Select task category";
  document.getElementById("selectContactsTitle").innerHTML =
    "Select contacts to assign";
  document.getElementById("clickedContacts").innerHTML = "";
  document.getElementById("restAmountContacts").innerHTML = "";
  CLICKED_CONTACTS = [];
  clearCheckedContacts();
  document.getElementById("inputDueDate").value = "";
  clearPrioBtn();
  clearSubtasks();
  hideErrorElements();
}

/**
 * Clears the checked contacts in the dropdown list.
 */
function clearCheckedContacts() {
  const checkboxes = document.querySelectorAll(
    '.listDropDown input[type="checkbox"]'
  );
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
}

/**
 * Clears the selected priority button.
 */
function clearPrioBtn() {
  if (SELECTED_PRIO_BTN) {
    deselectBtn(SELECTED_PRIO_BTN);
    SELECTED_PRIO_BTN.classList.remove("selectedPrioBtn");
  }
}

/**
 * Clears the subtasks.
 */
function clearSubtasks() {
  SUBTASKS = [];
  document.getElementById("subtasks").innerHTML = "";
  document.getElementById("addTaskSubtasks").value = "";
}

/**
 * Hides the error elements in the main container.
 */
function hideErrorElements() {
  const mainContainer = document.getElementsByClassName("mainContainer")[0];
  const elements = mainContainer.querySelectorAll('[id*="error"]');
  elements.forEach((element) => {
    element.classList.add("d-none");
  });
}

/*ONCLICK */

/**
 * Closes the adding a new category section.
 * @returns {void}
 */
function stopAddingNewCategory() {
  resetNewCategory();
  toggleNewCategory();
  toggleClass("listCategorys", "d-none");
}

/**
 * Toggles the display for selecting a new category.
 * @returns {void}
 */
function toggleNewCategory() {
  toggleClass("selectCategoryDiv", "d-none");
  toggleClass("newCategoryDiv", "d-none");
  toggleClass("newCategoryColorSelection", "d-none");
}

/**
 * Closes the AddTask display.
 * @returns {void}
 */
function closeAddTask() {
  toggleClass("body", "overflowHidden");
  hideDisplay("contentAddTaskDisplay", "animation-slideInRight", "d-none");
  clearTask();
  document.getElementById("clearBtn").classList.remove("d-none");
  document.getElementById("createBtn").classList.remove("d-none");
  document.getElementById("editBtn").classList.add("d-none");
}
