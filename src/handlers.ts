import { App } from "@slack/bolt";
import { UNDERSCORE_BLOCK, weegeeChannelId } from "./constants";
import { getOutputText } from "./getOutputText";
import { State } from "./state";
import { getRequiredAnswerCount } from "./getRequiredAnswerCount";
import { getWeightedLetter } from "./getWeightedLetter";

const state = new State();

type CommandHandler = Parameters<(typeof App)["prototype"]["command"]>;
type MessageHandler = Parameters<(typeof App)["prototype"]["message"]>;

export const commandHandler: CommandHandler = [
  "/zelem",
  async ({ command, ack, say, respond }) => {
    await ack();

    if (state.currentQuestion) {
      await respond(
        "Be patient! There's already another request for divination in progress..."
      );
      return;
    }

    if (!command.text.length || (!command.text.endsWith("?") && !command.text.match(UNDERSCORE_BLOCK) )) {
      await respond("Learn how to ask a real question ya goober.");
      return;
    }

    state.currentQuestion = command.text;
    state.currentMessage = getWeightedLetter();
    state.requiredAnswerCount = getRequiredAnswerCount(state.currentQuestion);
    await say(state.currentQuestion);
    await say(state.currentMessage);
  },
];

export const messageHandler: MessageHandler = [
  async ({ message, say }) => {
    if (
      message.channel !== weegeeChannelId ||
      message.subtype === "bot_message" ||
      !!message.subtype ||
      !message.text
    ) {
      return;
    }

    if (
      state.currentMessage &&
      message.text.length === 1 &&
      message.user !== state.lastMessageUser
    ) {
      if (message.text === "_") {
        if (state.requiredAnswerCount > 1) {
          state.requiredAnswerCount = state.requiredAnswerCount - 1;
        } else {
          await say(
            `There are no extra words required, '_' ignored. Nice one <@${message.user}>...`
          );
          return;
        }
      }

      state.currentMessage += message.text;
      state.lastMessageUser = message.user;
      return;
    }

    if (message.text.toLowerCase() === "goodbye") {
      if (!state.currentMessage || message.user === state.lastMessageUser) {
        return;
      }

      const output = getOutputText(state.currentQuestion, state.currentMessage);
      state.currentMessage = "";
      state.requiredAnswerCount = 0;
      state.currentQuestion = "";
      state.lastMessageUser = undefined;

      await say(`Zelem says: ${output} (Ended by <@${message.user}>)`);
      return;
    }
  },
];
