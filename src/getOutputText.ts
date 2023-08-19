import { UNDERSCORE_BLOCK, UNDERSCORE_BLOCK_NO_GLOBAL } from "./constants";

export function getOutputText(currentQuestion: string, currentMessage: string) {
  const questionHasUnderscores = new RegExp(UNDERSCORE_BLOCK).test(
    currentQuestion,
  );
  if (!questionHasUnderscores) {
    return `${currentQuestion} *${currentMessage}*.`;
  }

  return currentMessage
    .split("_")
    .reduce(
      (question, part) =>
        question.replace(new RegExp(UNDERSCORE_BLOCK_NO_GLOBAL), `*${part}*`),
      currentQuestion,
    );
}
