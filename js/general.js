/* GLOBAL VARIABLES*/

let USERS = [];
let CATEGORYS = [];
let LOGGED_USER = "";
let CONTACTS = [];

const SAMPLE_DATA_CONTACTS = [
  {
    id: 1,
    color: "#FF0000",
    name: "Max Mustermann",
    email: "max.mustermann@test",
    phone: 0123456789,
    initials: "MM",
  },
  {
    id: 2,
    color: "#00FF00",
    name: "Erika Musterfrau",
    email: "erika.musterfrau@test",
    phone: 0123456788,
    initials: "EM",
  },
  {
    id: 3,
    color: "#0000FF",
    name: "John Doe",
    email: "john.doe@test",
    phone: 0123456799,
    initials: "JD",
  },
  {
    id: 4,
    color: "#FFFF00",
    name: "Johny Depp",
    email: "johny.depp@test",
    phone: 0123456777,
    initials: "JD",
  },
  {
    id: 5,
    color: "#00FFFF",
    name: "Laura Residenz",
    email: "laura.residenz@test",
    phone: 0123456766,
    initials: "LR",
  },
  {
    id: 6,
    color: "#FFA500",
    name: "Hannah Müller",
    email: "hannah.mueller@test",
    phone: 01234566789,
    initials: "HM",
  },
];

const SAMPLE_DATA_CATEGORYS = [
  {
    name: "Developing",
    color: "blue",
  },
  {
    name: "HR",
    color: "red",
  },
  {
    name: "Marketing",
    color: "orange",
  },
  {
    name: "Sales",
    color: "green",
  },
];

async function init(currentHtmlTemplate) {
  await includeHTML();
  styleCurrentSectionInNav(currentHtmlTemplate);
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    await loadHTML(includeElements[i]);
  }
}

async function loadHTML(_element, _file) {
  let file = _file;
  let element = _element;

  if (!file) {
    file = element.getAttribute("w3-include-html");
  } else {
    element = document.getElementById(_element);
  }

  let resp = await fetch(file);
  if (resp.ok) {
    element.innerHTML = await resp.text();
  } else {
    element.innerHTML = "Page not found";
  }
}

function styleCurrentSectionInNav(currentHtmlTemplate) {
  if (!currentHtmlTemplate) return;
  const path = window.location.pathname;
  if (path.includes(currentHtmlTemplate)) {
    document.getElementById(currentHtmlTemplate).classList.add("activeSection");
  }
}

async function loadUserData() {
  try {
    USERS = JSON.parse(await getItem("users"));
    console.log("USERS SERVER", USERS);
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function setDataForGreeting(userId) {
  setItemInLocalStorage("loggedUserId", userId);
}

function toggleClass(elementId, className) {
  let element = document.getElementById(elementId);
  element.classList.toggle(className);
}

function toggleBlurFilter() {
  const elements = document.querySelectorAll("nav, header, #content");
  elements.forEach((element) => {
    if (element.classList.contains("filterBlur")) {
      element.classList.remove("filterBlur");
    } else {
      element.classList.add("filterBlur");
    }
  });
}

function playAnimation(id, animationClass) {
  let element = document.getElementById(id);
  element.classList.add(animationClass);
}

function changeImageOnHover(elementId, imgSrcOnHover, imgSrcOnMouseOut) {
  const element = document.getElementById(elementId);
  const parent = element.parentElement;
  element.addEventListener("mouseover", () => {
    element.src = imgSrcOnHover;
  });
  element.addEventListener("mouseout", () => {
    element.src = imgSrcOnMouseOut;
  });
  parent.addEventListener("mouseover", () => {
    element.src = imgSrcOnHover;
  });
  parent.addEventListener("mouseout", () => {
    element.src = imgSrcOnMouseOut;
  });
}

function loadTemplate(template) {
  window.location = template;
}

function setItemInLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItemFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key);
}

/***************************DISPLAYS******************************/

function showDisplay(id, animationClass, className) {
  toggleClass(id, className);
  playAnimation(id, animationClass);
  toggleBlurFilter();
}

function hideDisplay(id, className) {
  toggleClass(id, className);
  toggleBlurFilter();
}

function toggleClass(elementId, className) {
  let element = document.getElementById(elementId);
  element.classList.toggle(className);
}

function getUserData(id) {
  const user = USERS.find((user) => user.id === id);
  return user;
}

function getContactData(id) {
  const contact = CONTACTS.find((contact) => contact.id === id);
  return contact;
}

function getDataLoggedUser() {
  let loggedUserId = getItemFromLocalStorage("loggedUserId");
  if (loggedUserId === "Guest") {
    LOGGED_USER.name = "Guest";
  } else {
    LOGGED_USER = getUserData(loggedUserId);
  }
}

async function getLoggedUser() {
  const loggedUserId = getItemFromLocalStorage("loggedUserId");
  if (!loggedUserId) {
    loadTemplate("../index.html");
  } else {
    LOGGED_USER = getUserData(loggedUserId);
    console.log("LOGGED_USER:", LOGGED_USER);
  }
}

async function logOut() {
  removeItemFromLocalStorage("loggedUserId");
  loadTemplate("../index.html");
}

function hideError(id) {
  const errorElement = document.getElementById(id);
  if (!errorElement.classList.contains("d-none")) {
    errorElement.classList.add("d-none");
  }
}

function showError(id) {
  const errorElement = document.getElementById(id);
  errorElement.classList.remove("d-none");
}

function getUserId() {
  const id = USERS.length + 1;
  return id;
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function getInitials(fullname) {
  if (fullname) {
    const partsOfName = fullname.trim().split(" ");
    let initials = "";
    if (oneName(partsOfName)) {
      initials = getFirstTwoInitials(partsOfName[0]);
    } else {
      initials = getFirstAndLastInitial(partsOfName);
    }
    return initials;
  }
}

function oneName(partsOfName) {
  return partsOfName.length === 1;
}

function getFirstTwoInitials(name) {
  const firstInitial = name[0].toUpperCase();
  const secondInitial = name[1].toUpperCase();
  const initials = firstInitial + secondInitial;
  return initials;
}

function getFirstAndLastInitial(partsOfName) {
  const firstNameInitial = partsOfName[0][0].toUpperCase();
  const lastNameInitial = partsOfName[partsOfName.length - 1][0].toUpperCase();
  const initials = firstNameInitial + lastNameInitial;
  return initials;
}

function sortArrayAlphabetically(array) {
  array.sort((a, b) => a.name.localeCompare(b.name));
}
