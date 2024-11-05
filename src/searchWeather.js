import { showElement } from "./utils.js";
import { hideElement } from "./utils.js";

const locationSearchPanel = document.querySelector(".location-search");
const showLocationSearchBtn = document.querySelector(".main-nav__location-btn");
const hideLocationSearchBtn = document.querySelector(".location-search__top-close-btn");

showElement(showLocationSearchBtn, locationSearchPanel);
hideElement(hideLocationSearchBtn, locationSearchPanel);
