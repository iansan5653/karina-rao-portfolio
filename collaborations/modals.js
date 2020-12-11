/**
 * @returns {HTMLElement[]}
 */
function getModalLinks() {
  return [...document.getElementsByClassName("gallery__link")];
}

/**
 * @param {HTMLAnchorElement} link
 */
function onModalLinkClick(link) {
  openModal(link.getAttribute("href"));
}

function bindModalLinks() {
  getModalLinks().forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      onModalLinkClick(link);
    })
  );
}

/**
 * @param {string} href
 * @returns {Promise<HTMLDivElement>}
 */
async function getModalElement(href) {
  const fullPageHtml = await (await fetch(href)).text();
  const container = document.createElement("html");
  container.innerHTML = fullPageHtml;
  const modal = container.getElementsByClassName("collaboration")[0];
  modal.addEventListener("click", (event) => {
    event.stopPropagation();
    if (event.target === modal) {
      onCloseButtonClick(modal);
    }
  });
  getCloseButtons(modal).forEach((button) =>
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      onCloseButtonClick(modal);
    })
  );
  return modal;
}

/**
 * @param {string} href
 */
async function openModal(href) {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  const modalContent = await getModalElement(href);
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);
}

/**
 * @param {HTMLDivElement} modal
 */
function closeModal(modal) {
  modal.parentElement.removeChild(modal);
}

/**
 * @param {HTMLDivElement} modal
 */
function getCloseButtons(modal) {
  return [...modal.getElementsByClassName("collaboration__close-button")];
}

/**
 * @param {HTMLDivElement} link
 */
function onCloseButtonClick(modal) {
  closeModal(modal);
}

document.addEventListener("DOMContentLoaded", () => {
  bindModalLinks();
});
