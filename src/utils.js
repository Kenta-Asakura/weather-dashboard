// Show/Hide toggle an element

export function showElement(btn, element) {
  btn.addEventListener('click', () => {
    const elementClass = element.classList[0];
    element.classList.add(`${elementClass}--visible`);
  });
};

export function hideElement(closeBtn, element) {
  closeBtn.addEventListener('click', () => {
    const elementClass = element.classList[0];
    element.classList.remove(`${elementClass}--visible`);
  });
}
