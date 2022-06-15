import mongoose from "mongoose";
const { Schema } = mongoose;

export const StatusOptions = Object.freeze({
  OLD: "Old",
  REJECTED: "Rejected",
  NOT_REVIEWED: "Not reviewed",
  APPROVED: "Approved",
});

const TranslationSchema = new Schema(
  {
    language_key: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusOptions),
      required: true,
    },
    version: {
      type: Number,
    },
    submitted_by: {
      type: String,
      required: true,
    },
    approved_by: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_auto_generated: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Language_Translation", TranslationSchema);
