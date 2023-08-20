import mongoose from "mongoose";
import { mongoUrl } from "./env";

function shuffleArray<T extends Array<any>>(array: T) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export const lore = (async () => {
  await mongoose.connect(mongoUrl);
  const LoreRecordSchema = new mongoose.Schema({
    text: String,
    endedBy: String,
    endedByNickname: String,
    date: Date,
  });
  const LoreRecordModel = mongoose.model("Record", LoreRecordSchema);

  const load = () => LoreRecordModel.find().exec().then(shuffleArray);
  let theLore = await load();
  console.log(`Loaded ${theLore.length} records`);
  return {
    write: (data: {
      text: string;
      endedBy: string;
      endedByNickname?: string;
    }) => new LoreRecordModel({ ...data, date: new Date() }).save(),
    retrieve: async () => {
      if (theLore.length === 0) {
        theLore = await load();
      }
      return theLore.pop()!!;
    },
  };
})();
