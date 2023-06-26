let currentDraggedElement;

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(processStep) {
  TASKS[currentDraggedElement].processStep = processStep;
  await setItem("users", JSON.stringify(USERS));
  unhighlightArea(processStep);
  renderTasks();
}

function highlightArea(id) {
  document.getElementById(id).classList.add("dragArea");
}

function unhighlightArea(id) {
  document.getElementById(id).classList.remove("dragArea");
}

function searchCards(event) {
  const searchText = event.target.value.toLowerCase();
  console.log(searchText);
  const todoCards = document.querySelectorAll("#todo .singleCard");
  const inProgressCards = document.querySelectorAll("#inProgress .singleCard");
  const awaitingFeedbackCards = document.querySelectorAll(
    "#awaitingFeedback .singleCard"
  );
  const doneCards = document.querySelectorAll("#done .singleCard");

  hideCards(todoCards);
  hideCards(inProgressCards);
  hideCards(awaitingFeedbackCards);
  hideCards(doneCards);

  searchInCards(searchText, todoCards);
  searchInCards(searchText, inProgressCards);
  searchInCards(searchText, awaitingFeedbackCards);
  searchInCards(searchText, doneCards);
}

function hideCards(cards) {
  cards.forEach((card) => {
    card.style.display = "none";
  });
}

function searchInCards(searchText, cards) {
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
