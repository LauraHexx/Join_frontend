/**
 * Includes HTML content with the attribute 'w3-include-html' into the current document.
 * @async
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    await loadHTML(includeElements[i]);
  }
}

/**
 * Loads HTML content into an element.
 * @param {HTMLElement} _element - The target element to load the HTML content into.
 * @param {string} [_file] - The file path to load the HTML content from.
 * @async
 */
async function loadHTML(_element, _file) {
  let file = _file;
  let element = _element;
  if (!file) {
    file = element.getAttribute("w3-include-html");
  } else {
    element = document.getElementById(_element);
  }
  await renderHtml(element, file);
}

/**
 * Renders the HTML content into an element.
 * @param {HTMLElement} element - The target element to render the HTML content into.
 * @param {string} file - The file path to load the HTML content from.
 * @async
 */
async function renderHtml(element, file) {
  let resp = await fetch(file);
  if (resp.ok) {
    element.innerHTML = await resp.text();
  } else {
    element.innerHTML = "Page not found";
  }
}
