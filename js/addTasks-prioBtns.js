/*PRIO BUTTONS*******************************************************************************/

/**
 * Changes the style the priority buttons.
 * @param {string} id - The ID of the clicked button.
 * @param {string} backgroundColor - The background color to set for the button.
 */
function changeStylePrioBtn(id, backgroundColor) {
  const btns = document.querySelectorAll(".singlePrioBtn");
  const clickedBtn = document.getElementById(id);
  const currentImg = clickedBtn.querySelector("img");
  if (SELECTED_PRIO_BTN !== clickedBtn) {
    selectBtn(clickedBtn, backgroundColor, currentImg);
    deselectBtn(SELECTED_PRIO_BTN);
    SELECTED_PRIO_BTN = clickedBtn;
  }
  updateHoverEffect(btns, clickedBtn);
}

/**
 * Updates the style of the clicked Button.
 * @param {HTMLElement} clickedBtn - The clicked button
 * @param {string} backgroundColor - The background color to set for the button.
 * @param {HTMLElement} img - The image element inside the button.
 */
function selectBtn(clickedBtn, backgroundColor, img) {
  clickedBtn.style.backgroundColor = backgroundColor;
  clickedBtn.style.color = "white";
  img.src = img.src.replace(".svg", "White.svg");
}

/**
 * Deselects a button and restores its original style.
 * @param {HTMLElement} SELECTED_PRIO_BTN - The currently selected button.
 */
function deselectBtn(SELECTED_PRIO_BTN) {
  if (SELECTED_PRIO_BTN) {
    const img = SELECTED_PRIO_BTN.querySelector("img");
    SELECTED_PRIO_BTN.style.backgroundColor = "";
    SELECTED_PRIO_BTN.style.color = "";
    img.src = img.src.replace("White.svg", ".svg");
  }
}

/**
 * Updates the hover effect for priority buttons.
 * @param {NodeList>} btns - The list of all priority buttons.
 * @param {HTMLElement} clickedBtn - The currently clicked button.
 */
function updateHoverEffect(btns, clickedBtn) {
  btns.forEach((btn) => {
    if (btn === clickedBtn) {
      btn.classList.add("selectedPrioBtn");
    } else {
      btn.classList.remove("selectedPrioBtn");
    }
  });
}
