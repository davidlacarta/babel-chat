import { useGlobalState, ACTIONS } from "state/GlobalState";
import { langs, Lang, LangType } from "i18n/langs";

export default function useLangs() {
  const {
    state: { lang },
    dispatch,
  } = useGlobalState();

  function toogle() {
    const newLang =
      lang.type === LangType.SPANISH ? langs.english : langs.spanish;

    dispatch({ type: ACTIONS.CHANGE_LANGUAGE, payload: newLang });
  }

  return {
    lang,
    toogle,
  } as { lang: Lang; toogle: () => void };
}
