/*ADD A NEW CATEGORY*/

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
  } else if (categoryNameAlreadyExists(newCategory)) {
    setErrorsCategoryAlreadyExists();
    newCategory = undefined;
  } else {
    hideError("errorNewCategoryNoNameEntered");
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
    hideError("errorNewCategoryNoNameEntered");
    hideError("errorNewCategoryNameAlreadyExists");
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
