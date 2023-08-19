import mongoose from "mongoose";
import { mongoUrl } from "./env";

const scriptures = (async () => {
  const conn = await mongoose.connect(mongoUrl);
  const LoreRecordSchema = new conn.Schema({
    text: String,
    endedBy: String,
    endedByNickname: String,
    date: Date,
  });
  const LoreRecordModel = conn.model("Record", LoreRecordSchema);

  return {
    write: (data: { text: string; endedBy: string; endedByNickname: string }) =>
      new LoreRecordModel({ ...data, date: new Date() }),
  };
})();
