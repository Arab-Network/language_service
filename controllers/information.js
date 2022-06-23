import LanguageInformation from "../models/Information.js";

export const getAll = async (req, res) => {
  try {
    const doc = await LanguageInformation.find({});
    if (doc.length === 0) {
      return res.status(400).json({ status: "No results were found." });
    }

    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: "E@108" });
  }
};

export const get = async (req, res) => {
  const { key } = req.params;
  try {
    const doc = await LanguageInformation.findOne({ key });
    if (!doc) {
      return res.status(400).json({ status: "not found" });
    }

    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: "E@109" });
  }
};

export const add = async (req, res) => {
  const { key, actual_name, symbol, versions } = req.body;
  try {
    if (!key | !actual_name | !Number.isInteger(versions)) {
      return res.status(422).json({
        status: "missing fields",
        error_message: "(key, actual_name, versions) fields are required.",
      });
    }

    const oldDoc = await LanguageInformation.findOne({ key });
    if (oldDoc) {
      return res
        .status(400)
        .json({ status: "This key already exists and cannot be recreated." });
    }

    const doc = await LanguageInformation.create({
      key,
      actual_name,
      symbol,
      versions,
    });

    return res.status(201).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: "E@110" });
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

    if (!doc) {
      return res.status(400).json({ status: "not found" });
    }

    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: "E@111" });
  }
};

export const addVersions = async (req, res) => {
  const { key } = req.params;
  const { versions } = req.body;
  try {
    const doc = await LanguageInformation.findOneAndUpdate(
      { key },
      {
        $inc: {
          versions: parseInt(versions),
        },
      },
      {
        new: true,
      }
    );
    if (!doc) return res.status(400).json({ status: "not found" });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: "E@112" });
  }
};

export const deleteOne = async (req, res) => {
  const { key } = req.params;
  try {
    const doc = await LanguageInformation.deleteOne({ key });

    if (doc.deletedCount !== 1) {
      return res.status(400).json({ status: "not found" });
    }

    return res.status(200).json({ status: "success" });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: "E@113" });
  }
};
