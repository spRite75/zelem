import mongoose from "mongoose";
import { mongoUrl } from "./env";

export const lore = (async () => {
  await mongoose.connect(mongoUrl);
  const LoreRecordSchema = new mongoose.Schema({
    text: String,
    endedBy: String,
    endedByNickname: String,
    date: Date,
  });
  const LoreRecordModel = mongoose.model("Record", LoreRecordSchema);

  return {
    write: (data: {
      text: string;
      endedBy: string;
      endedByNickname?: string;
    }) => new LoreRecordModel({ ...data, date: new Date() }).save(),
  };
})();
