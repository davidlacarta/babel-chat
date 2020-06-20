import { useState } from "react";

export type Lang = {
  flag: string;
  code: "es" | "en";
  username: string;
  message: string;
  send: string;
};

const langs = {
  spain: {
    flag: "🇪🇸",
    code: "es",
    username: "Escribe tu nick aquí...",
    message: "Escribe un mensaje aquí...",
    send: "Enviar",
  } as Lang,
  england: {
    flag: "🇬🇧",
    code: "en",
    username: "Type your username here...",
    message: "Type a message here...",
    send: "Send",
  } as Lang,
};

export default function useLangs() {
  const [lang, setLang] = useState<Lang>(langs.spain);

  function toogle() {
    setLang(lang.code === langs.spain.code ? langs.england : langs.spain);
  }

  return {
    lang,
    toogle,
  };
}
