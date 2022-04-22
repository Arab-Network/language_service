import mongoose from "mongoose";
const { Schema } = mongoose;

const LanguageInformation = new Schema(
  {
    key: {
      // en
      type: String,
      unique: true,
    },
    actual_name: {
      // english
      type: String,
      unique: true,
    },
    symbol: {
      // 🇬🇧
      type: String,
      unique: true,
    },
    versions: {
      type: [Number],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("LanguagesInformation", LanguageInformation);
