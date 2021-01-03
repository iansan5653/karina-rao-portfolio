/**
 * Bind all modal links to open modals.
 */
function bindModalLinks() {
  for (const link of document.getElementsByClassName("gallery__link")) {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const content = await buildCollaborationModal(link.getAttribute("href"));
      openModal(content);
    });
  }
}

/**
 * Asynchronously load the modal HTML element from the corresponding collaboration file.
 * @param {string} href The URL of the page that should be displayed in the modal.
 * @return {Promise<HTMLDivElement>}
 */
async function buildCollaborationModal(href) {
  const fullPageHtml = await (await fetch(href)).text();
  const modalContent = buildElement(fullPageHtml).getElementsByClassName("collaboration")[0];

  for (const button of modalContent.getElementsByClassName("collaboration__close-button")) {
    button.classList.add("modal__close-button");
  }

  return modalContent;
}

/**
 * Build and display the content located at the `href` URL in a modal dialog box.
 * @param {HTMLElement} modalContent Modal element content to display.
 */
async function openModal(modalContent) {
  modalContent.classList.add("modal-content");

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");

  modalContainer.appendChild(modalContent);
  bindCloseEvents(modalContainer);

  document.body.appendChild(modalContainer);

  // makes the visibility toggle after the element is rendered in the DOM:
  setTimeout(() => toggleModalVisibility(modalContainer), 50);
}

/**
 * @param {HTMLElement} modalContainer
 */
function bindCloseEvents(modalContainer) {
  modalContainer.addEventListener("click", (event) => {
    event.stopPropagation();

    if (event.target === modalContainer) {
      // clicked on backdrop itself
      closeModal(modalContainer);
    }
  });

  for (const button of modalContainer.getElementsByClassName("modal__close-button")) {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal(modalContainer);
    });
  }
}

/**
 * @param {HTMLElement} modalContainer
 */
function toggleModalVisibility(modalContainer) {
  return new Promise((resolve) => {
    modalContainer.addEventListener("transitionend", () => resolve(), { once: true });
    modalContainer.classList.toggle("modal-container--visible");
  });
}

/**
 * Remove an HTML element from the DOM.
 * @param {HTMLDivElement} element The element to remove.
 */
function removeElement(element) {
  element.parentElement.removeChild(element);
}

/**
 * Handle close button click.
 * @param {HTMLElement} modalContainer
 */
async function closeModal(modalContainer) {
  await toggleModalVisibility(modalContainer);
  removeElement(modalContainer);
}

/**
 * Build an HTML string into an Element instance contained by a wrapper `<html>` element.
 * @param {string} html The HTML string to render.
 * @return {HTMLElement}
 */
function buildElement(html) {
  const container = document.createElement("html");
  container.innerHTML = html;
  return container;
}

document.addEventListener("DOMContentLoaded", () => bindModalLinks());
