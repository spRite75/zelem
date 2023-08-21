import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { getWeightedLetter } from "./getWeightedLetter";
import { getRequiredAnswerCount } from "./getRequiredAnswerCount";

const storagePath = "storage";
const stateFile = join(storagePath, "state.json");

interface IState {
  currentQuestion: string | null;
  currentMessage: string | null;
  lastMessageUser: string | null;
  requiredAnswerCount: number;
}

export class State implements IState {
  private _currentQuestion: string | null = null;
  private _currentMessage: string | null = null;
  private _lastMessageUser: string | null = null;
  private _requiredAnswerCount: number = 0;

  private deserialise(fromString: string) {
    const savedState = JSON.parse(fromString) as Partial<IState>;
    console.log(
      `Loaded existing state: ${JSON.stringify(savedState, undefined, 2)}`,
    );
    if (savedState.currentQuestion) {
      this._currentQuestion = savedState.currentQuestion;
    }
    if (savedState.currentMessage) {
      this._currentMessage = savedState.currentMessage;
    }
    if (savedState.lastMessageUser) {
      this._lastMessageUser = savedState.lastMessageUser;
    }
    if (savedState.requiredAnswerCount) {
      this._requiredAnswerCount = savedState.requiredAnswerCount;
    }
  }

  private serialise() {
    return JSON.stringify(
      {
        currentQuestion: this.currentQuestion,
        currentMessage: this.currentMessage,
        lastMessageUser: this.lastMessageUser,
        requiredAnswerCount: this.requiredAnswerCount,
      } as IState,
      undefined,
      2,
    );
  }

  constructor() {
    mkdirSync(storagePath, { recursive: true });

    try {
      this.deserialise(readFileSync(stateFile).toString("utf8"));
    } catch (e) {
      console.log(`Couldn't load existing state: ${e}`);
    }

    setInterval(() => writeFileSync(stateFile, this.serialise()), 10 * 1000);
  }

  reset() {
    this._currentQuestion = null;
    this._currentMessage = null;
    this._lastMessageUser = null;
    this._requiredAnswerCount = 0;
  }

  startQuestion(question: string) {
    const firstLetter = getWeightedLetter();
    this._currentQuestion = question;
    this._currentMessage = firstLetter;
    this._lastMessageUser = null;
    this._requiredAnswerCount = getRequiredAnswerCount(question);

    return { question, firstLetter } as const;
  }

  addLetter({ letter, user }: { letter: string; user: string }) {
    this._currentMessage += letter;
    this._lastMessageUser = user;
  }

  startNextWord(user: string) {
    this._requiredAnswerCount -= 1;
    this._lastMessageUser = user;
  }

  get currentQuestion() {
    return this._currentQuestion;
  }

  get currentMessage() {
    return this._currentMessage;
  }

  get lastMessageUser() {
    return this._lastMessageUser;
  }

  get requiredAnswerCount() {
    return this._requiredAnswerCount;
  }
}
