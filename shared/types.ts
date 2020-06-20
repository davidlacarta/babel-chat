export type Message = {
  message: string;
  username: string;
  room: string;
  translation?: {
    es: string;
    en: string;
  };
};
