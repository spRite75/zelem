import { letterScores } from "./constants";

export const getWeightedLetter = () => {
  const lettersArray: string[] = [];
  letterScores.forEach((letterScore) => {
    const weight = 11 - letterScore.score;
    for (let i = 0; i < weight; i++) {
      lettersArray.push(letterScore.letter);
    }
  });
  return lettersArray[
    Math.floor(Math.random() * lettersArray.length)
  ].toUpperCase();
};
