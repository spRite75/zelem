export class State {
  private pCurrentQuestion: string;
  private pCurrentMessage: string;
  private pLastMessageUser?: string;
  private pRequiredAnswerCount: number;

  constructor() {
    this.pCurrentMessage = "";
    this.pCurrentQuestion = "";
    this.pLastMessageUser = undefined;
    this.pRequiredAnswerCount = 0;
  }

  get currentQuestion() {
    return this.pCurrentQuestion;
  }
  set currentQuestion(newValue: string) {
    this.pCurrentQuestion = newValue;
  }

  get currentMessage() {
    return this.pCurrentMessage;
  }
  set currentMessage(newValue: string) {
    this.pCurrentMessage = newValue;
  }

  get lastMessageUser() {
    return this.pLastMessageUser;
  }
  set lastMessageUser(newValue: string | undefined) {
    this.pLastMessageUser = newValue;
  }

  get requiredAnswerCount() {
    return this.pRequiredAnswerCount;
  }
  set requiredAnswerCount(newValue: number) {
    this.pRequiredAnswerCount = newValue;
  }
}
