//SEARCH FOR TASKS

let searchText = [];
let todoCards = [];
let inProgressCards = [];
let awaitingFeedbackCards = [];
let doneCards = [];

/**
 * Searches for tasks based on the entered text.
 * @param {Event} event - The input event object.
 */
function searchTask(event) {
  setSearchedText(event);
  summarizeTasksOfOneProcessStep();
  hideAllTasks();
  searchInAllTasks();
}

/**
 * Sets the searched text based on the input value.
 * @param {Event} event - The input event object.
 */
function setSearchedText(event) {
  searchText = event.target.value.toLowerCase();
}

/**
 * Summarizes the tasks of each process step by selecting the respective cards.
 */
function summarizeTasksOfOneProcessStep() {
  todoCards = document.querySelectorAll("#todo .singleCard");
  inProgressCards = document.querySelectorAll("#inProgress .singleCard");
  awaitingFeedbackCards = document.querySelectorAll(
    "#awaitingFeedback .singleCard"
  );
  doneCards = document.querySelectorAll("#done .singleCard");
}

/**
 * Hides all tasks by hiding the specified cards.
 */
function hideAllTasks() {
  hideCards(todoCards);
  hideCards(inProgressCards);
  hideCards(awaitingFeedbackCards);
  hideCards(doneCards);
}

/**
 * Hides the specified cards.
 * @param {NodeList} cards - The cards to be hidden.
 */
function hideCards(cards) {
  cards.forEach((card) => {
    card.style.display = "none";
  });
}

/**
 * Searches for the entered text in all tasks by searching in the specified cards.
 * @param {NodeList} cards - The cards to search in.
 */
function searchInAllTasks() {
  searchInCards(todoCards);
  searchInCards(inProgressCards);
  searchInCards(awaitingFeedbackCards);
  searchInCards(doneCards);
}

/**
 * Searches for the entered text in the specified cards' titles and descriptions.
 * Displays the card if the search text is found.
 * @param {NodeList} cards - The cards to search in.
 */
function searchInCards(cards) {
  cards.forEach((card) => {
    const title = card.querySelector(".title").textContent.toLowerCase();
    const description = card
      .querySelector(".description")
      .textContent.toLowerCase();

    if (title.includes(searchText) || description.includes(searchText)) {
      card.style.display = "flex";
    }
  });
}
