import "dotenv/config";

import axios from "axios";

const { GOOGLE_TRANSLATE_RAPIDAPI_KEY } = process.env;

export default async (
  targetLanguage,
  data,
  sourceLanguage = "en",
  url = "https://google-translate1.p.rapidapi.com/language/translate/v2"
) => {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.append("target", targetLanguage);
    encodedParams.append("source", sourceLanguage);
    Object.values(data).forEach((value) => encodedParams.append("q", value));

    const options = {
      method: "POST",
      url,
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

    if (translations.length !== Object.keys(data).length) {
      throw new Error("Some values are missing.");
    }

    translations.forEach((translationObject, i) => {
      data[Object.keys(data)[i]] = translationObject.translatedText;
    });

    return data;
  } catch (e) {
    throw new Error("Error occurred while calling the API:", e.message);
  }
};
