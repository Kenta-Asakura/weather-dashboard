export function getElement(selector: string): HTMLElement {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element as HTMLElement;
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


// Debounce
// export function debounce(cb, delay = 300) {
//   let timeout;

//   return (...args) => {
//     clearTimeout(timeout)
//     timeout = setTimeout(() => {
//       cb(...args)
//     }, delay)
//   }
// }

export function debounce<T extends (...args: any[]) => void>(
  cb: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}


//
interface City {
  name: string;
  state_name: string;
  country_code: string;
  latitude: string;
  longitude: string;
}

export function findMatches(wordToMatch: string, cities: City[]): City[] {
  const trimmedWord = wordToMatch.trim();
  if (!trimmedWord) return [];
  const regex = new RegExp(trimmedWord, "i");

  return cities.filter((city) => {
    return city.name.match(regex) || city.state_name.match(regex);
  });
}
