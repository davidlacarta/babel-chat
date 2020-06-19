import { Translate } from "@google-cloud/translate/build/src/v2";

export async function translate({
  googleCloudTranslate,
  message,
  lang,
}: {
  googleCloudTranslate: Translate;
  message: string;
  lang: string;
}) {
  try {
    const [translation] = await googleCloudTranslate.translate(message, lang);

    return translation;
  } catch (error) {
    console.log(error);
    return "";
  }
}
