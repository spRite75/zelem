import { App } from "@slack/bolt";
import { UNDERSCORE_BLOCK, devChannelId, weegeeChannelId } from "./constants";
import { getOutputText } from "./getOutputText";
import { State } from "./state";
import { isProduction } from "./env";
import { lore } from "./lore";

const state = new State();

type CommandHandler = Parameters<(typeof App)["prototype"]["command"]>;
type MessageHandler = Parameters<(typeof App)["prototype"]["message"]>;

const channel = isProduction ? weegeeChannelId : devChannelId;

export const commandHandlers: CommandHandler[] = [
  [
    isProduction ? "/zelem" : "/dev-zelem",
    async ({ command, ack, say, respond }) => {
      await ack();

      if (state.currentQuestion) {
        await respond(
          "Be patient! There's already another request for divination in progress...",
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

      const { question, firstLetter } = state.startQuestion(command.text);
      await say({ channel, text: question });
      await say({ channel, text: firstLetter });
    },
  ],
  [
    isProduction ? "/lore" : "/dev-lore",
    async ({ command, ack, say, client }) => {
      await ack();

      const { text, endedBy, date } = await (await lore).retrieve();

      const respond = () =>
        say({
          channel: command.channel_id,
          text: `Zelem said: ${text} (Ended by <@${endedBy}> on ${date?.toLocaleDateString(
            "en-au",
          )})`,
        });

      try {
        await respond();
      } catch {
        await client.conversations.join({ channel: command.channel_id });
        await respond();
      }
    },
  ],
];

export const messageHandler: MessageHandler = [
  async ({ message, say, client }) => {
    if (
      // Validate channel
      message.channel !== channel ||
      // Regular messages only (no subtype)
      !!message.subtype ||
      // Need text to exist and have content
      !message.text ||
      // Need currentMessage to exist and have content
      !state.currentMessage ||
      // Don't take any inputs from the last person to contribute (production only)
      (isProduction && message.user === state.lastMessageUser)
    ) {
      return;
    }

    if (message.text.length === 1) {
      if (message.text === "_") {
        if (state.requiredAnswerCount > 1) {
          state.startNextWord(message.user);
          return;
        } else {
          await say({
            channel,
            text: `There are no extra words required, '_' ignored. Nice one <@${message.user}>...`,
          });
          return;
        }
      }

      state.addLetter({ letter: message.text, user: message.user });
      return;
    }

    if (message.text.toLowerCase() === "goodbye") {
      if (!state.currentQuestion || !state.currentMessage) return;
      const output = getOutputText(state.currentQuestion, state.currentMessage);
      console.debug(`got goodbye for message: ${output}`);
      state.reset();

      await say(`Zelem says: ${output} (Ended by <@${message.user}>)`);
      const endedByNickname = (await client.users.info({ user: message.user }))
        .user?.name;
      (await lore).write({
        text: output,
        endedBy: message.user,
        endedByNickname,
      });
      return;
    }
  },
];
