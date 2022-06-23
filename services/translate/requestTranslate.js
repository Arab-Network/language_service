import "dotenv/config";
import { StatusOptions } from "../../models/Translation.js";
import axios from "axios";

const { GOOGLE_TRANSLATE_RAPIDAPI_KEY } = process.env;

export default async (sourceLanguage, targetLanguage, data) => {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.append("source", sourceLanguage);
    encodedParams.append("target", targetLanguage);

    data.forEach((translationPart) =>
      encodedParams.append("q", translationPart.value)
    );

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      timeout: 10000,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
        "X-RapidAPI-Key": GOOGLE_TRANSLATE_RAPIDAPI_KEY,
      },
      data: encodedParams,
    };

    const response = await axios.request(options);
    const { translations } = response.data.data;

    if (translations.length !== data.length) {
      throw new Error("Some values are missing.");
    }

    const translatedData = [];

    translations.forEach((translationObject, i) => {
      translatedData.push({
        language_key: targetLanguage,
        key: data[i].key,
        value: translationObject.translatedText,
        status: StatusOptions.NOT_REVIEWED,
        is_auto_generated: true,
      });
    });

    return translatedData;
  } catch (e) {
    throw new Error("Error occurred while calling the API:", e.message);
  }
};
