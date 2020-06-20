export type Message = {
  message: string;
  username: string;
  room: string;
  translation?: Translation;
};

export type Translation = {
  es: string;
  en: string;
};
