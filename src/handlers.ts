import { App } from "@slack/bolt";
import { UNDERSCORE_BLOCK, devChannelId, weegeeChannelId } from "./constants";
import { getOutputText } from "./getOutputText";
import { State } from "./state";
import { getRequiredAnswerCount } from "./getRequiredAnswerCount";
import { getWeightedLetter } from "./getWeightedLetter";
import { isProduction } from "./env";

const state = new State();

type CommandHandler = Parameters<(typeof App)["prototype"]["command"]>;
type MessageHandler = Parameters<(typeof App)["prototype"]["message"]>;

const channel = isProduction ? weegeeChannelId : devChannelId;

export const commandHandler: CommandHandler = [
  "/zelem",
  async ({ command, ack, say, respond }) => {
    if (
      (isProduction && command.text.startsWith("dev")) ||
      (!isProduction && !command.text.startsWith("dev"))
    ) {
      return;
    }

    await ack();

    if (state.currentQuestion) {
      await respond(
        "Be patient! There's already another request for divination in progress..."
      );
      return;
    }

    if (
      !command.text.length ||
      (!command.text.endsWith("?") && !command.text.match(UNDERSCORE_BLOCK))
    ) {
      await respond("Learn how to ask a real question ya goober.");
      return;
    }

    state.currentQuestion = command.text;
    state.currentMessage = getWeightedLetter();
    state.requiredAnswerCount = getRequiredAnswerCount(state.currentQuestion);
    state.lastMessageUser = undefined;
    await say({ channel, text: state.currentQuestion });
    await say({ channel, text: state.currentMessage });
  },
];

export const messageHandler: MessageHandler = [
  async ({ message, say }) => {
    if (
      // Validate channel
      message.channel !== channel ||
      // Regular messages only (no subtype)
      !!message.subtype ||
      // Need text to exist and have content
      !message.text ||
      // Need currentMessage to exist and have content
      !state.currentMessage ||
      // Don't take any inputs from the last person to contribute
      message.user === state.lastMessageUser
    ) {
      return;
    }

    if (message.text.length === 1) {
      if (message.text === "_") {
        if (state.requiredAnswerCount > 1) {
          state.requiredAnswerCount = state.requiredAnswerCount - 1;
        } else {
          await say({
            channel,
            text: `There are no extra words required, '_' ignored. Nice one <@${message.user}>...`,
          });
          return;
        }
      }

      state.currentMessage += message.text;
      state.lastMessageUser = message.user;
      return;
    }

    if (message.text.toLowerCase() === "goodbye") {
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
