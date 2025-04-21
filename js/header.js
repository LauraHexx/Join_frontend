/**
 * Opens the menu by clicking on "profile image" in the header
 */
function openMenu() {
  toggleClass("menuHeaderBg", "d-none");
  toggleClass("menuHeader", "d-none");
  playAnimation("menuHeader", "animation-menuSlideInRight");
}

/**
 * Closes the menu of the header
 */
function closeMenu() {
  toggleClass("menuHeaderBg", "d-none");
  toggleClass("menuHeader", "d-none");
}

/**
 * Logs out the user and clears local storage.
 */
async function logUserOut() {
  await logOut();
  removeUserFromLocalStorage();
}
