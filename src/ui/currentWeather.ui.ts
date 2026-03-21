import { WeatherData } from '../types/weather.types';
import { AsyncState } from '../types/ui.types';
import { getElement } from './dom';

const elements = {
  locationBtn: getElement<HTMLButtonElement>('.main-nav__location-btn'),
  city: getElement<HTMLHeadingElement>('.current-weather__city'),
  temp: getElement<HTMLHeadingElement>('.current-weather__temperature'),
  condition: getElement<HTMLParagraphElement>('.current-weather__condition'),
  tempHi: getElement<HTMLSpanElement>('.current-weather__temperature-range__high'),
  tempLo: getElement<HTMLSpanElement>('.current-weather__temperature-range__low'),
};

export function render(state: AsyncState<WeatherData>): void {
  const { locationBtn, city, temp, condition, tempHi, tempLo } = elements;

  switch (state.status) {
    case 'idle':
        city.textContent = '';
        temp.textContent = '';
        condition.textContent = '';
        tempHi.textContent = '';
        tempLo.textContent = '';
      break;
    case 'loading':
        city.textContent = 'Loading...';
        temp.textContent = '--';
        condition.textContent = '';
        tempHi.textContent = '';
        tempLo.textContent = '';
      break;
    case 'success': {
        const { data } = state;
        locationBtn.innerHTML = `${data.cityName}, ${data.country} <span class='caret'></span>`;
        city.textContent = data.cityName;
        temp.textContent = `${data.temperature}°`;
        condition.textContent = data.condition;
        tempHi.textContent = `H:${data.tempMax}°`;
        tempLo.textContent = `L:${data.tempMin}°`;
      break
    }
    case 'error':
        city.textContent = 'Error loading data';
        temp.textContent = '--';
        condition.textContent = state.error;
        tempHi.textContent = '';
        tempLo.textContent = '';
      break
    default:
      break;
  }
}