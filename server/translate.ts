import { Translate } from "@google-cloud/translate/build/src/v2";

export type Props = {
  googleCloudTranslate: Translate;
  message: string;
  lang: string;
};

export default async function translate({
  googleCloudTranslate,
  message,
  lang,
}: Props) {
  try {
    const [translation] = await googleCloudTranslate.translate(message, lang);

    return translation;
  } catch (error) {
    console.log(error);
  }
}
