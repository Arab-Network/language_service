import Translation, { StatusOptions } from "../models/Translation.js";
import LanguageInformation from "../models/Information.js";
import requestTranslate from "../services/translate/requestTranslate.js";
import languages from "../services/translate/languages.js";

// TODO: add error codes/internal codes

export const getAllTranslations = async (req, res) => {
  const { status } = req.query;
  try {
    let doc;
    if (status) {
      if (!Object.values(StatusOptions).includes(status)) {
        return res
          .status(422)
          .json({ error_message: `Invalid status choice: ${status}` });
      }
      doc = await Translation.find({ status });
    } else {
      doc = await Translation.find({});
    }

    if (doc.length === 0)
      return res.status(400).json({ status: "no results were found" });

    return res.status(200).json(doc);
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", error_code: 100, error_message: e.message });
  }
};

export const getAllByKey = async (req, res) => {
  const { key } = req.params;
  const { status } = req.query;
  try {
    let doc;
    if (status) {
      if (!Object.values(StatusOptions).includes(status)) {
        return res
          .status(422)
          .json({ error_message: `Invalid status choice: ${status}` });
      }
      doc = await Translation.find({ language_key: key, status });
    } else {
      doc = await Translation.find({ language_key: key });
    }

    if (doc.length === 0)
      return res.status(400).json({ status: "no results were found" });

    return res.status(200).json(doc);
  } catch (e) {
    return res
      .status(500)
      .json({ status: "error", error_code: 101, error_message: e.message });
  }
};

export const getApprovedTranslation = async (req, res) => {
  const { key } = req.params;
  const { parsed } = req.query;
  try {
    const doc = await Translation.findOne({
      language_key: key,
      status: StatusOptions.APPROVED,
    });

    if (!doc)
      return res.status(400).json({
        status:
          "Couldn't find an approved translation for the selected language.",
      });

    return Boolean(eval(parsed)) === true
      ? res.status(200).json(doc.data)
      : res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const getByVersion = async (req, res) => {
  const { key, version } = req.params;
  const { parsed } = req.query;
  try {
    const doc = await Translation.findOne({ language_key: key, version });
    if (!doc) return res.status(400).json({ status: "no results were found" });

    return Boolean(eval(parsed)) === true
      ? res.status(200).json(doc.data)
      : res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

export const addNewTranslation = async (req, res) => {
  const { data } = req.body;
  try {
    if (!data) {
      return res.status(422).json({
        status: "missing fields",
        error_message: '"data" field is required.',
      });
    }

    const languageInfoDoc = await LanguageInformation.findOne({
      key: data.language_key,
    });
    if (!languageInfoDoc) {
      return res.status(422).json({
        status: "missing record",
        error_message:
          "The requested language key is missing from the information collection.",
      });
    }

    delete data.approved_by;
    delete data.is_auto_generated;

    const validatedData = {
      ...data,
      status: StatusOptions.NOT_REVIEWED,
      version: languageInfoDoc.versions + 1,
      submitted_by: req.oidc.user.name,
    };

    const languageTranslationDoc = await Translation.create(validatedData);

    const updateLanguageInfoDoc = await LanguageInformation.findOneAndUpdate(
      {
        key: data.language_key,
      },
      {
        versions: languageInfoDoc.versions + 1,
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
  const { key, version, status } = req.params;
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

    if (status === StatusOptions.APPROVED) {
      await Translation.updateMany(
        {
          status,
        },
        {
          status: StatusOptions.OLD,
        }
      );
      await Translation.findOneAndUpdate(
        {
          language_key: key,
          version,
        },
        {
          status,
          approved_by: req.oidc.user.name,
        },
        {
          new: true,
        }
      );
    } else {
      await Translation.findOneAndUpdate(
        {
          language_key: key,
          version,
        },
        {
          status,
        },
        {
          new: true,
        }
      );
    }
    return res.status(200).json({ status: "success" });
  } catch (e) {
    return res.status(500).json({ status: "error", error_message: e.message });
  }
};

// TODO: refactor
export const generateNewVersion = async (req, res) => {
  const { key } = req.params;
  const { version } = req.body;
  try {
    if (!languages.includes(key)) {
      return res.status(422).json({
        status: "bad param",
        error_message: "The requested language key is invalid.",
      });
    }

    const englishTranslation = await Translation.findOne({
      key: "en",
    }).sort({
      createdAt: -1,
    });
    console.log(englishTranslation);
    const translation = await requestTranslate(key, englishTranslation.data);

    let informationDoc = await LanguageInformation.findOne({ key });
    if (!informationDoc) {
      informationDoc = await LanguageInformation.create({
        key,
      });
    }

    const newVersion = !version
      ? Math.max(0, ...informationDoc.versions) + 0.1
      : version;

    const translationDoc = await Translation.create({
      key,
      version: newVersion,
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

// TODO: refactor
export const deleteByVersion = async (req, res) => {
  const { key, version } = req.params;
  try {
    const doc = await Translation.deleteOne({ key, version });
    if (doc.deletedCount !== 1) {
      return res.status(400).json({ status: "no results were found" });
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
