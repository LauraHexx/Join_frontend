let FIRST_INITIALS_NO_DUPLICAT = [];
let SELECTED_CONTACT = "";

/**
 * Sets the navigation and header for the contacts page, loads data and renders the contacts, and sets the contacts and categories drop-down menu in the add task display.
 * @async
 */
async function initContacts() {
  await setNavAndHeader("contacts");
  await loadDataAndRenderContacts();
  setEventsContacts();
  renderDropDownAddTaskDisplay();
}

/**
 * Loads user data and renders the contact list.
 * Displays a loading image during the loading time.
 * @async
 */
async function loadDataAndRenderContacts() {
  toggleClass("loadingContainer", "d-none");
  await loadUserData();
  await getLoggedUser();
  renderContactList();
}

/**
 * Sets event listeners for the contacts page.
 */
function setEventsContacts() {
  setEventScreenSize();
  setEventCloseDropDown();
  setEventListenerHoverBtn();
}

/*SHOW CONTACTS********************************************************************/

/**
 * Renders the contact list.
 */
function renderContactList() {
  CONTACTS = LOGGED_USER.contacts;
  if (CONTACTS) {
    sortArrayAlphabetically(CONTACTS);
    renderFirstInitialsList();
    renderContactsInInitialList();
  }
}

/**
 * Renders the first initials list without duplicates.
 * @async
 */
async function renderFirstInitialsList() {
  FIRST_INITIALS_NO_DUPLICAT = [];
  document.getElementById("contactList").innerHTML = "";
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    if (!FIRST_INITIALS_NO_DUPLICAT.includes(firstInitial)) {
      FIRST_INITIALS_NO_DUPLICAT.push(firstInitial);
      document.getElementById("contactList").innerHTML +=
        renderFirstInitialsListHtml(firstInitial);
    }
  });
}

/**
 * Renders the contacts in the initial list.
 */
function renderContactsInInitialList() {
  clearContacts();
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    const indexOfContact = CONTACTS.indexOf(contact);
    document.getElementById(`contactsLetter${firstInitial}`).innerHTML +=
      renderContactsInInitialListHtml(contact, indexOfContact);
  });
  toggleClass("loadingContainer", "d-none");
}

/**
 * Clears the contacts from the first initials list.
 */
function clearContacts() {
  const containers = document.querySelectorAll('[id^="contactsLetter"]');
  containers.forEach((container) => {
    container.innerHTML = "";
  });
}

/*CONTACT DETAILS***********************************************************************************/

/**
 * Opens the contact details for the given index.
 * @param {number} indexOfContact - The index of the contact to open.
 */
async function openContactDetails(indexOfContact) {
  if (!bigScreen()) {
    styleContactDetailsMobile();
  }
  if (animationIsNotPlaying()) {
    SELECTED_CONTACT = CONTACTS[indexOfContact];
    playAnimationContactDetails();
    renderContactDetails();
  }
}

/**
 * Styles the contact details for mobile view.
 */
function styleContactDetailsMobile() {
  document.getElementById("contactDetails").style.display = "flex";
  document.getElementById("contactList").style.display = "none";
}

/**
 * Checks if the contact details animation is not currently playing.
 * @returns {boolean} True if the animation is not playing, false otherwise.
 */
function animationIsNotPlaying() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  return !mainInfosContact.classList.contains("animation-slideInRight");
}

/**
 * Plays the animation for the contact details.
 * @async
 */
async function playAnimationContactDetails() {
  await playAnimation("mainInfosContact", "animation-slideInRight");
  setTimeout(() => {
    document
      .getElementById("mainInfosContact")
      .classList.remove("animation-slideInRight");
  }, 1000);
}

/**
 * Renders the contact details.
 */
function renderContactDetails() {
  document.getElementById("mainInfosContact").innerHTML = "";
  document.getElementById("mainInfosContact").innerHTML =
    renderContactDetailsHtml();
}

/**
 * Closes the detail information of the contact.
 */
function closeDetailInfos() {
  let detailInfos = document.getElementById("mainInfosContact");
  detailInfos.innerHTML = "";
}

/*EVENT LISTENER - SCREEN SIZE******************************************************************/

/**
 * Sets an event listener to monitor the screen size changes.
 */
function setEventScreenSize() {
  window.addEventListener("resize", monitorScreenSize);
}

/**
 * Monitors the screen size changes and adjusts the display of contact list and details accordingly.
 */
function monitorScreenSize() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  if (bigScreen()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "flex";
  } else if (!mainInfosAreKlicked(mainInfosContact)) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  } else if (mainInfosAreKlicked() && contactListStyleIsFlex()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  }
}

/**
 * Checks if the mainInfosContact is clicked by checking if its innerHTML is not empty.
 * @returns {boolean} A boolean indicating whether the mainInfosContact is clicked.
 */
function mainInfosAreKlicked() {
  return mainInfosContact.innerHTML.trim() !== "";
}

/**
 * Checks if the contact list style is set to flex.
 * @returns {boolean} A boolean indicating whether the contact list style is set to flex.
 */
function contactListStyleIsFlex() {
  return document.getElementById("contactList").style.display === "flex";
}

/**
 * Displays the contact list and hides the contact details when clickig "back" button.
 */
function showContactList() {
  document.getElementById("contactList").style.display = "flex";
  document.getElementById("contactDetails").style.display = "none";
}
