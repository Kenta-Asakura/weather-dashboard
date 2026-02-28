import { FlattenedCity } from "./types/location.types";

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

export function findMatches(wordToMatch: string, cities: FlattenedCity[]): FlattenedCity[] {
  const trimmedWord = wordToMatch.trim();
  if (!trimmedWord) return [];
  const regex = new RegExp(trimmedWord, "i");

  return cities.filter((city) => {
    return city.name.match(regex) || city.state_name.match(regex);
  });
}
