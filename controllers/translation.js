import LanguagesTranslations from "../models/language_translation.js";
import LanguageInformation from "../models/language_information.js";

export const getAllTranslations = async (req, res) => {
  try {
    const doc = await LanguagesTranslations.find({});
    if (doc.length === 0) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const getAll = async (req, res) => {
  const { key } = req.params;
  try {
    const doc = await LanguagesTranslations.find({ key });
    if (doc.length === 0) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const getLatest = async (req, res) => {
  const { key } = req.params;
  try {
    const doc = await LanguagesTranslations.findOne({ key }).sort({
      createdAt: -1,
    });
    if (!doc) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const getByVersion = async (req, res) => {
  const { key, version } = req.params;
  try {
    const doc = await LanguagesTranslations.findOne({ key, version });
    if (!doc) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const addNewVersion = async (req, res) => {
  const { key } = req.params;
  const { version, data } = req.body;
  try {
    if (!version | !data) {
      return res.status(422).json({
        status: "missing fields",
        error_message: '"version" & "data" fields are required.',
      });
    }

    const docInformation = await LanguageInformation.findOne({ key });
    if (!docInformation) {
      return res.status(422).json({
        status: "missing record",
        error_message:
          "The requested language key is missing from the information collection.",
      });
    }

    const docVersionExists = await LanguagesTranslations.findOne({
      key,
      version,
    });
    if (docInformation.versions.includes(version) | docVersionExists) {
      return res.status(422).json({
        status: "existing version",
        error_message:
          "The provided version for this language already exists in one of the collections.",
      });
    }

    const doc = await LanguagesTranslations.create({ key, version, data });
    const updateLanguageInformation =
      await LanguageInformation.findOneAndUpdate(
        {
          key,
        },
        {
          $addToSet: {
            versions: version,
          },
        },
        {
          new: true,
        }
      );
    return res.status(201).json({ updateLanguageInformation, doc });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const deleteByVersion = async (req, res) => {
  const { key, version } = req.params;
  try {
    const doc = await LanguagesTranslations.deleteOne({ key, version });
    if (doc.deletedCount !== 1) {
      return res.status(400).json({ status: "not found" });
    }
    const updateLanguageInformationVersion =
      await LanguageInformation.findOneAndUpdate(
        {
          key,
        },
        {
          $pull: {
            versions: version,
          },
        },
        {
          new: true,
        }
      );
    return res.status(200).json({ deleted: true });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};
