import "dotenv/config";
import { App } from "@slack/bolt";

import { token, appToken } from "./src/env";

(async () => {
  const app = new App({
    token,
    appToken,
    socketMode: true,
  });

  await app.start(process.env.PORT || 3000);

  app.message("teststring", async ({message, say}) => {
    await say(JSON.stringify(message))
  })

  console.log("⚡️ Bolt app is running!!");
})();
