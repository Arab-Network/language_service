import LanguageInformation from "../models/language_information.js";

export const getAll = async (req, res) => {
  try {
    const doc = await LanguageInformation.find({});
    if (doc.length === 0) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const get = async (req, res) => {
  const { key } = req.params;
  try {
    const doc = await LanguageInformation.findOne({ key });
    if (!doc) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const add = async (req, res) => {
  const { key, actual_name, symbol, versions } = req.body;
  try {
    if (!key | !actual_name | (versions & !Array.isArray(versions))) {
      return res.status(422).json({
        status: "missing fields",
        error_message: '"key" & "actual_name" fields are required.',
      });
    }
    const doc = await LanguageInformation.create({
      key,
      actual_name,
      symbol,
      versions,
    });
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const update = async (req, res) => {
  const { key } = req.params;
  try {
    const doc = await LanguageInformation.findOneAndUpdate(
      { key },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!doc) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const deleteOne = async (req, res) => {
  const { key } = req.params;
  try {
    const doc = await LanguageInformation.deleteOne({ key });
    if (doc.deletedCount !== 1) {
      return res.status(400).json({ status: "not found" });
    }
    return res.status(200).json({ deleted: true });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};
