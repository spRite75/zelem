import "dotenv/config";
import { App } from "@slack/bolt";

import { token, appToken } from "./src/env";
import { commandHandler, messageHandler } from "./src/handlers";

(async () => {
  const app = new App({
    token,
    appToken,
    socketMode: true,
  });

  await app.start(process.env.PORT || 3000);

  app.command(...commandHandler);
  app.message(...messageHandler);

  console.log("⚡️ Bolt app is running!!");
})();
