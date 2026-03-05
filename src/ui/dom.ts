// DOM utility functions
// Shared helpers for type-safe DOM manipulation

export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string
): T {
  const element = document.querySelector<T>(selector);
  
  if (!element) {
    throw new Error(`Element not found: "${selector}"`);
  }

  return element;
}

export const clearInnerHTML = (e:HTMLElement): void => {
  e.innerHTML = '';
}

export const clearInputValue = (e:HTMLInputElement) => {
  e.value = '';
}

// Show/Hide toggle an element
export function showElement(btn: HTMLElement, element: HTMLElement): void {
  btn.addEventListener('click', () => {
    const elementClass = element.classList[0];
    element.classList.add(`${elementClass}--visible`);
  });
};

export function hideElement(closeBtn: HTMLElement, element: HTMLElement): void {
  closeBtn.addEventListener('click', () => {
    const elementClass = element.classList[0];
    element.classList.remove(`${elementClass}--visible`);
  });
}