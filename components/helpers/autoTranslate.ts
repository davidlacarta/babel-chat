import { Translation } from "server/shared/types";
import { Lang, LangType } from "i18n/langs";

export default function autoTranslate({
  text,
  translation,
  lang,
}: {
  text?: string;
  translation?: Translation;
  lang: Lang;
}) {
  const textTranslated = translation?.[lang.type];
  const translationFound = text !== textTranslated;

  return translationFound ? textTranslated : translation?.[alternative(lang)];
}

function alternative(lang: Lang) {
  return LangType.ENGLISH === lang.type ? LangType.SPANISH : LangType.ENGLISH;
}
