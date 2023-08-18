import "dotenv/config";
import { App } from "@slack/bolt";
import Koa from "koa";

import { token, appToken } from "./src/env";
import { commandHandler, messageHandler } from "./src/handlers";

(async () => {
  console.log(process.env)
  const app = new App({
    token,
    appToken,
    socketMode: true,
  });

  const server = new Koa();
  server.use(async (ctx) => {
    ctx.body = 'Hello World!'
  })

  server.listen(process.env.PORT ?? 3000);
  await app.start();

  app.command(...commandHandler);
  app.message(...messageHandler);
})();
