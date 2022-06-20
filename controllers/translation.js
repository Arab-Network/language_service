import Translation, { StatusOptions } from "../models/Translation.js";
import LanguageInformation from "../models/Information.js";
import requestTranslate from "../services/translate/requestTranslate.js";
import languages from "../services/translate/languages.js";

export const getAllTranslations = async (req, res) => {
  const { status, is_deleted } = req.query;
  try {
    const isDeleted = Boolean(eval(is_deleted)) || false;
    const dbQuery = { is_deleted: isDeleted };

    let doc;
    if (status) {
      if (!Object.values(StatusOptions).includes(status)) {
        return res
          .status(422)
          .json({ error_message: `Invalid status choice: ${status}` });
      }
      dbQuery.status = status;
    }

    doc = await Translation.find(dbQuery);

    if (doc.length === 0) {
      return res.status(400).json({ status: "no results were found" });
    }

    return res.status(200).json(doc);
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", error_code: 100, error_message: e.message });
  }
};

export const getAllByLanguageKey = async (req, res) => {
  const { language_key } = req.params;
  const { status, is_deleted } = req.query;
  try {
    const isDeleted = Boolean(eval(is_deleted)) || false;
    const dbQuery = {
      language_key,
      is_deleted: isDeleted,
    };

    let doc;
    if (status) {
      if (!Object.values(StatusOptions).includes(status)) {
        return res
          .status(422)
          .json({ error_message: `Invalid status choice: ${status}` });
      }
      dbQuery.status = status;
    }

    doc = await Translation.find(dbQuery);

    if (doc.length === 0) {
      return res.status(400).json({ status: "no results were found" });
    }

    return res.status(200).json(doc);
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", error_code: 101, error_message: e.message });
  }
};

export const getApprovedTranslationsByLanguageKey = async (req, res) => {
  const { language_key } = req.params;
  try {
    const doc = await Translation.find({
      language_key,
      status: StatusOptions.APPROVED,
    });

    if (!doc) {
      return res.status(400).json({
        status:
          "Couldn't find an approved translations for the selected language.",
      });
    }

    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const getByVersion = async (req, res) => {
  const { language_key } = req.params;
  const { version, key } = req.query;
  try {
    const doc = await Translation.findOne({ language_key, key, version });
    if (!doc) {
      return res.status(400).json({ status: "no results were found" });
    }

    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const addNewTranslation = async (req, res) => {
  const { language_key } = req.params;
  const { data } = req.body;
  try {
    if (!data) {
      return res.status(422).json({
        status: "missing fields",
        error_message: '"data" field is required.',
      });
    }

    const languageInfoDoc = await LanguageInformation.findOne({
      key: language_key,
    });
    if (!languageInfoDoc) {
      return res.status(422).json({
        status: "missing record",
        error_message:
          "The requested language key is missing from the information collection.",
      });
    }

    const validatedData = [];

    for (key in data) {
      const version =
        (await Translation.findOne(
          {
            language_key,
            key,
          },
          {
            id: 0,
            version: 1,
          }
        )?.version) || 1;

      validatedData.push({
        language_key,
        key,
        value: data[key],
        status: StatusOptions.NOT_REVIEWED,
        version,
        submitted_by: req.oidc.user.name,
      });
    }
    const languageTranslationDoc = await Translation.insertMany(validatedData);

    const updateLanguageInfoDoc = await LanguageInformation.findOneAndUpdate(
      {
        key: language_key,
      },
      {
        versions: languageInfoDoc.versions + validatedData.length,
      },
      {
        new: true,
      }
    );

    return res.status(201).json({
      language_information: updateLanguageInfoDoc,
      language_translation: languageTranslationDoc,
    });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const updateStatus = async (req, res) => {
  const { language_key } = req.params;
  const { key, status, version } = req.body;

  try {
    if (!key | !version | !status) {
      return res.status(422).json({
        status: "missing fields",
        error_message: "(key, version, status) fields are required.",
      });
    }

    if (!Object.values(StatusOptions).includes(status)) {
      return res
        .status(422)
        .json({ error_message: `Invalid status choice: ${status}` });
    }

    const dbQuery = {
      status,
    };

    if (status === StatusOptions.APPROVED) {
      dbQuery.approved_by = req.oidc.user.name;
    }

    await Translation.findOneAndUpdate(
      {
        language_key,
        key,
        version,
      },
      dbQuery,
      {
        new: true,
      }
    );

    await Translation.updateMany(
      {
        language_key,
        key,
        status,
      },
      {
        status: StatusOptions.OLD,
      }
    );

    return res.status(200).json({ status: "success" });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

// TODO: continue refactoring
export const generateNewVersion = async (req, res) => {
  const { from, to } = req.query;
  try {
    if (!languages.includes(from) | !languages.includes(to)) {
      return res.status(422).json({
        status: "bad query",
        error_message: "One of the requested languages keys is invalid.",
      });
    }

    const approvedTranslation = await Translation.find({
      key: from,
      status: StatusOptions.APPROVED,
    });
    if (!approvedTranslation) {
      return res.status(422).json({
        error_message:
          "Couldn't find an approved translation for the source language.",
      });
    }

    const translation = await requestTranslate(from, to, approvedTranslation);

    let informationDoc = await LanguageInformation.findOne({ key });
    if (!informationDoc) {
      informationDoc = await LanguageInformation.create({
        key,
      });
    }

    const translationDoc = await Translation.create({
      key,
      version: Math.max(informationDoc.versions) || 1,
      is_auto_generated: true,
      data: translation,
    });

    const updateLanguageInformation =
      await LanguageInformation.findOneAndUpdate(
        {
          key,
        },
        {
          $addToSet: {
            versions: newVersion,
          },
        },
        {
          new: true,
        }
      );

    return res.status(201).json({
      language_information: updateLanguageInformation,
      language_translation: translationDoc,
    });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const deleteByVersion = async (req, res) => {
  const { language_key, version } = req.params;
  try {
    const doc = await Translation.findOneAndUpdate(
      {
        language_key,
        version,
      },
      {
        is_deleted: true,
      },
      {
        new: true,
      }
    );

    if (!doc.is_deleted) {
      return res.status(400).json({
        status: "some error occurred while trying to delete the translation.",
      });
    }

    await LanguageInformation.findOneAndUpdate(
      {
        key: language_key,
      },
      {
        $inc: {
          versions: -1,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ status: "success" });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};
