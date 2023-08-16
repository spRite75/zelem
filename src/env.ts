export const token = process.env.SLACK_BOT_TOKEN ?? ''
export const appToken = process.env.SLACK_APP_TOKEN ?? ''
export const isProduction = process.env.IS_PRODUCTION === "true"
