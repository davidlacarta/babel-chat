import { useState } from "react";

export type Lang = {
  flag: string;
  code: "es" | "en";
  username: string;
  message: string;
  send: string;
  joined: (username: string) => string;
  disconnected: (username: string) => string;
};

const langs = {
  spain: {
    flag: "🇪🇸",
    code: "es",
    username: "Escribe tu nick aquí...",
    message: "Escribe un mensaje aquí...",
    send: "Enviar",
    joined: (username: string) =>
      `👋 Usuario <strong>${username}</strong> ha entrado en la sala`,
    disconnected: (username: string) =>
      `🏃 Usuario <strong>${username}</strong> ha salido de la sala`,
  } as Lang,
  england: {
    flag: "🇬🇧",
    code: "en",
    username: "Type your username here...",
    message: "Type a message here...",
    send: "Send",
    joined: (username: string) =>
      `👋 User <strong>${username}</strong> has joined into the room`,
    disconnected: (username: string) =>
      `🏃 User <strong>${username}</strong> has disconnected from room`,
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
