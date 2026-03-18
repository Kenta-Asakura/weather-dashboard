import { WeatherData } from '../types/weather.types';
import { AsyncState } from '../types/ui.types';
import { getElement } from './dom';

// --- DOM Element Cache ---
const elements = {
  locationBtn: getElement<HTMLButtonElement>('.main-nav__location-btn'),
  city: getElement<HTMLHeadingElement>('.current-weather__city'),
  temp: getElement<HTMLHeadingElement>('.current-weather__temperature'),
  condition: getElement<HTMLParagraphElement>('.current-weather__condition'),
  tempHi: getElement<HTMLSpanElement>('.current-weather__temperature-range__high'),
  tempLo: getElement<HTMLSpanElement>('.current-weather__temperature-range__low'),
};

export function render(state: AsyncState<WeatherData>): void {
  switch (state.status) {
    case 'loading':
        elements.city.textContent = 'Loading...';
        elements.temp.textContent = '--';
        elements.condition.textContent = '';
        elements.tempHi.textContent = '';
        elements.tempLo.textContent = '';
      break;
  
    default:
      break;
  }
}