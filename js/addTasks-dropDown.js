/*DROP DOWN - ADD TASK************************************************************************************/

/**
 * Sets up event listeners to close the dropdown menus.
 * Invokes the necessary functions to handle dropdown closing.
 */
function setEventCloseDropDown() {
  closeDropDown();
  toggleCategoryDropDownContainer();
  toggleContactDropDownContainer();
}

/**
 * Listens for clicks on the page and hides the dropdown lists if the clicked element
 * is not within the selectContactsDiv or selectCategoryDiv.
 */
function closeDropDown() {
  document.addEventListener("click", handleClickOnPage);
  function handleClickOnPage(event) {
    if (
      !event.target.closest("#selectContactsDiv") ||
      !event.target.closest("#selectCategoryDiv")
    ) {
      hideDropdown("listContacts");
      hideDropdown("listCategorys");
    }
  }
}

/**
 * Hides a dropdown list by adding the 'd-none' class to the element.
 * @param {string} id - The ID of the dropdown list element.
 */
function hideDropdown(id) {
  let dropDownList = document.getElementById(id);
  dropDownList.classList.add("d-none");
}

/**
 * Listens for clicks on the selectCategoryDiv element and toggles the visibility of the listCategorys dropdown list.
 */
function toggleCategoryDropDownContainer() {
  document
    .getElementById("selectCategoryDiv")
    .addEventListener("click", handleClick);

  function handleClick(event) {
    event.stopPropagation();
    toggleClass("listCategorys", "d-none");
  }
}

/**
 * Listens for clicks on the selectContactsDiv element and toggles the visibility of the listContacts dropdown list.
 */
function toggleContactDropDownContainer() {
  document
    .getElementById("selectContactsDiv")
    .addEventListener("click", handleClick);

  function handleClick(event) {
    event.stopPropagation();
    toggleClass("listContacts", "d-none");
  }
}
