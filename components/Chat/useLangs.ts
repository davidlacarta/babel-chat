import { useState } from "react";

export type Lang = {
  flag: string;
  code: "es" | "en";
  locale: string;
  username: string;
  message: string;
  send: string;
  join: string;
  joined: (username: string) => string;
  disconnected: (username: string) => string;
  typing: (writters: String[]) => string;
};

const langs = {
  spain: {
    flag: "🇪🇸",
    code: "es",
    locale: "es-ES",
    username: "Tú nombre",
    message: "Escribe un mensaje aquí...",
    send: "Enviar",
    join: "Entrar",
    joined: (username: string) =>
      `👋 Usuario <strong>${username}</strong> ha entrado`,
    disconnected: (username: string) =>
      `🏃 Usuario <strong>${username}</strong> ha salido`,
    typing: (writters: String[]) =>
      `✍ ${writters.join(", ")} está${
        writters.length > 1 ? "n" : ""
      } escribiendo...`,
  } as Lang,
  england: {
    flag: "🇬🇧",
    code: "en",
    locale: "en-GB",
    username: "Your name",
    message: "Type a message here...",
    send: "Send",
    join: "Join",
    joined: (username: string) =>
      `👋 User <strong>${username}</strong> has joined`,
    disconnected: (username: string) =>
      `🏃 User <strong>${username}</strong> has disconnected`,
    typing: (writters: String[]) =>
      `✍ ${writters.join(", ")} ${
        writters.length > 1 ? "are" : "is"
      } writing...`,
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
