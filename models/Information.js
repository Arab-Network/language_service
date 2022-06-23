import mongoose from "mongoose";
const { Schema } = mongoose;

const InformationSchema = new Schema(
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
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Language_Information", InformationSchema);
