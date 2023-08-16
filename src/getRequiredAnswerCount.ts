import { UNDERSCORE_BLOCK } from './constants';

export function getRequiredAnswerCount(prompt: string) {
    return prompt.match((new RegExp(UNDERSCORE_BLOCK)))?.length || 1;
}
