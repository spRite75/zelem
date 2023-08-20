import { App } from "@slack/bolt";
import Koa from "koa";

import { httpPort, token, appToken } from "./src/env";
import { commandHandlers, messageHandler } from "./src/handlers";

(async () => {
  const server = new Koa();
  server.use(async (ctx) => {
    ctx.body = "Hello World!";
  });
  server.listen(httpPort);
  console.log(`HTTP listening on port ${httpPort}`);

  const app = new App({
    token,
    appToken,
    socketMode: true,
  });

  await app.start();
  commandHandlers.forEach((handler) => app.command(...handler));
  app.message(...messageHandler);
})();
