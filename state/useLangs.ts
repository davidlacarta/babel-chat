import { useGlobalState, ACTIONS } from "state";
import { langs, Lang } from "i18n/langs";

export default function useLangs() {
  const {
    state: { lang },
    dispatch,
  } = useGlobalState();

  function toogle() {
    const newLang =
      lang.code === langs.spain.code ? langs.england : langs.spain;
    dispatch({ type: ACTIONS.CHANGE_LANGUAGE, lang: newLang });
  }

  return {
    lang,
    toogle,
  } as { lang: Lang; toogle: () => void };
}
