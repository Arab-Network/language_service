import mongoose from "mongoose";
const { Schema } = mongoose;

const LanguageTranslation = new Schema(
  {
    key: {
      // en
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    is_auto_generated: {
      type: Boolean,
      default: false,
    },
    data: {
      type: String,
      get: function (data) {
        try {
          return JSON.parse(data);
        } catch (error) {
          return data;
        }
      },
      set: function (data) {
        return JSON.stringify(data);
      },
    },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("LanguagesTranslations", LanguageTranslation);
