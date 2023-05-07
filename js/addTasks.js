async function initAddTask() {
  await loadUsers();
  await sortUsersAlphabetically();
  await loadCategorys();
  showContent();
}

async function sortUsersAlphabetically() {
  USERS = USERS.sort((a, b) => a.initials.localeCompare(b.initials));
}

async function sortCategorysAlphabetically() {
  CATEGORYS = CATEGORYS.sort((a, b) => a.name.localeCompare(b.name));
}

function showContent() {
  init("addTask");
  document.getElementById("content").classList.remove("d-none");
}

async function addCategory() {
  let newCategory = getCategory();
  let colour = getSelectedColor();
  checkAndPushData(newCategory, colour);
}

async function checkAndPushData(newCategory, colour) {
  if (newCategory && colour) {
    CATEGORYS.push({
      name: newCategory,
      color: colour,
    });
    await sortCategorysAlphabetically();
    setItem("categorys", JSON.stringify(CATEGORYS));
    toggleClass("selectCategory", "d-none");
    toggleClass("newCategory", "d-none");
    toggleClass("listCategorys", "d-none");
    toggleClass("categorysColours", "d-none");
  }
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
  const selectedColorDiv = document.querySelector(".selectedColor");
  if (selectedColorDiv) {
    document.getElementById("errorColor").classList.add("d-none");
    return selectedColorDiv.id;
  } else {
    document.getElementById("errorColor").classList.remove("d-none");
    return;
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
    <li class="singleCategory">
      <span>${name}</span>
      <div id=${color} class="circle"></div>
    </li>
  `;
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
