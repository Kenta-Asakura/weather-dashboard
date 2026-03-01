import { FlattenedCity } from "./types/location.types";

export function findMatches(wordToMatch: string, cities: FlattenedCity[]): FlattenedCity[] {
  const trimmedWord = wordToMatch.trim();
  if (!trimmedWord) return [];
  const regex = new RegExp(trimmedWord, "i");

  return cities.filter((city) => {
    return city.name.match(regex) || city.state_name.match(regex);
  });
}
