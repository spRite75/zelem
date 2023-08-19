import "dotenv/config";

export const httpPort = process.env.PORT ?? 3000;
export const token = process.env.SLACK_BOT_TOKEN ?? "";
export const appToken = process.env.SLACK_APP_TOKEN ?? "";
export const isProduction = process.env.IS_PRODUCTION === "true";
export const mongoUrl = (() => {
  const val = process.env.MONGO_URL;
  if (!val) throw new Error("MONGO_URL is not defined");
  return val;
})();
