import { getElement } from './dom';

const elements = {
  panel: getElement('.location-search'),
  openBtn: getElement<HTMLButtonElement>('.main-nav__location-btn'),
  closeBtn: getElement<HTMLButtonElement>('.location-search__top-close-btn'),
  input: getElement<HTMLInputElement>('#location-input'),
  resultsList: getElement<HTMLUListElement>('.location-search__bottom-results-list'),
  // Current weather preview inside the search panel
  previewCity: getElement<HTMLParagraphElement>('.location-search__top-current-location'),
  previewTemp: getElement<HTMLSpanElement>('.location-search__top-current-temperature'),
};
