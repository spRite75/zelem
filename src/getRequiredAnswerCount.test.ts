import { getRequiredAnswerCount } from "./getRequiredAnswerCount";

describe("getRequiredAnswerCount", () => {
  const tests: Array<{ input: string; result: number }> = [
    {
      input: "Why is Nick questioning her sexuality?",
      result: 1,
    },
    {
      input: "Why is ___ so good?",
      result: 1,
    },
    {
      input: "Today, ____ had ___ for breakfast.",
      result: 2,
    },
    {
      input: "My favourt pasttime is: ___ ___ ___ ___.",
      result: 4,
    },
  ];

  tests.forEach(({ input, result }) =>
    test(`${input} should return ${result}`, () =>
      expect(getRequiredAnswerCount(input)).toEqual(result)),
  );
});
