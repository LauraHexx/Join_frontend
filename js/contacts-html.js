function renderFirstInitialsListHtml(firstInitial) {
  return /*html*/ `
      <div class="oneSection">
        <span id="letterCategory">${firstInitial}</span>
         <div class="partingLineGrey"></div>
         <div id="contactsLetter${firstInitial}"></div>
      </div>
  `;
}

function renderContactsInInitialListHtml(contact, indexOfContact, initials) {
  return /*html*/ `
     <div
        onclick="openContactDetails(${indexOfContact})"
        class="singleContact">
        <div style="background-color: ${contact.color}" class="initialsOfNames smallCircle">${contact.initials}</div>
        <div id="deatilsOfUSer">
          <span>${contact.name}</span>
          <br />
          <a 
          href="mailto:${contact.email}"
          onclick="event.stopPropagation();">
          ${contact.email}</a>
        </div>
      </div>
    `;
}

function renderContactDetailsHtml() {
  return /*html*/ `
     <div class="addTaskToContact gap">
       <div class="initialsOfNames bigCircle" style="background-color: ${SELECTED_CONTACT.color}">${SELECTED_CONTACT.initials}</div>
       <div class="nameAndAddTask">
         <span class="name">${SELECTED_CONTACT.name}</span>
         <a
           onclick="showDisplay('contentAddTaskDisplay', 'animation-slideInRight', 'd-none'); toggleClass('body', 'overflowHidden')"
           class="addTask">
           <img
             src="../assets/img/plusBlue.svg"
             alt="image of icon to add a task" />
           <span>Add Task</span>
         </a>
       </div>
     </div>
     <div class="editContact gap">
       <span>Contact Information</span>
       <a
         onclick="renderEditContact()">
         <img
           src="../assets/img/pencilBlue.svg"
           alt="image of icon to edit contact" />
         <span class="editContactSpan">Edit Contact</span>
       </a>
     </div>
     <div class="emailAndPhone gap">
       <div class="email">
         <span class="bold">Email</span>
         <a href="mailto:${SELECTED_CONTACT.email}">${SELECTED_CONTACT.email}</a>
       </div>
       <div class="phone">
         <span class="bold">Phone</span>
         <a href="tel:${SELECTED_CONTACT.phone_number}">${SELECTED_CONTACT.phone_number}</a>
       </div>
     </div>
    `;
}

function renderEditContactHtml() {
  return /*html*/ `
      <div onclick="event.stopPropagation()" class="displayEditContact">
        <div class="leftSectionEdit">
          <img
            onclick="hideDisplay('contentEditDisplay','animation-slideInRight', 'd-none'); toggleClass('body', 'overflowHidden')"
            class="cursorPointer closeWhite d-none"
            src="../assets/img/closeWhite.svg"
            alt="image of icon to close the editing" />
          <img
            class="logoEdit"
            src="../assets/img/logoWhite.svg"
            alt="logo of join" />
          <h1>Edit contact</h1>
          <div class="blueLine"></div>
        </div>
        <div class="rightSectionEdit">
          <img
            onclick="hideDisplay('contentEditDisplay','animation-slideInRight', 'd-none'); toggleClass('body', 'overflowHidden')"
            class="cursorPointer closeDarkEdit"
            src="../assets/img/closeDark.svg"
            alt="image of icon to close the adding" />
          <div id="editContactInitials" class="bigCircleEdit" style="background-color:${SELECTED_CONTACT.color}">${SELECTED_CONTACT.initials}</div>
          <form onsubmit="getDataEditContact(); return false" class="formEdit">
          <div class="inputContainer">  
            <input
                value="${SELECTED_CONTACT.name}"
                id="editContactName"
                class="input inputName"
                type="name"
                placeholder="Name"
                maxlength="25"
                minlength="2"
                required />
                <span id="errorNameIsAlreadyTaken" class="error d-none">Name already belongs to a contact. Please update it.</span>
                <span id="errorUserNameIsAlreadyTaken" class="error d-none">Username is already taken. Please update it.</span>
                </div>
            <div class="inputContainer">
              <input
                value="${SELECTED_CONTACT.email}"
                id="editContactEmail"
                class="input inputEmail"
                type="email"
                placeholder="Email"
                maxlength="25"
                minlength="2"
                required />
              <span id="errorEmailIsAlreadyTaken" class="error d-none">Email already belongs to a contact. Please update it.</span>
            </div>
              <input
                value="${SELECTED_CONTACT.phone_number}"
                id="editContactPhone"
                class="input inputPhone"
                type="number"
                placeholder="Phone"
                minlength="8"
                maxlength="15"
                />
            <div class="editContactBtns">
            <input
                onclick="deleteContact()"
                class="closeEdit"
                value="Delete" />
              <button class="saveBtn">Save</button>
            </div>
          </form>
        </div>
      </div>
    `;
}
