import { getOutputText } from './getOutputText';

describe('getOutputText', () => {
    const tests: Array<{input: Parameters<typeof getOutputText>, result: string}> = [
        {
            input: ['What is your favourite colour?', 'MAGENTA'],
            result: 'What is your favourite colour? *MAGENTA*.',
        },
        {
            input: ['Why is ___ your favourite colour?', 'BRIMSTONE'],
            result: 'Why is *BRIMSTONE* your favourite colour?',
        },
        {
            input: ['We have a ___ problem call the ___ exterminators.', '12HOURTIME_DWEEB'],
            result: 'We have a *12HOURTIME* problem call the *DWEEB* exterminators.',
        },
        {
            input: ['____ ____ ____ make a man fatt.', 'HALAL_SNACK_PACKS'],
            result: '*HALAL* *SNACK* *PACKS* make a man fatt.',
        },
    ];

    tests.forEach(({input, result}) =>
        test(`${input} should return ${result}`, () => expect(getOutputText(...input)).toEqual(result)),
    );
});