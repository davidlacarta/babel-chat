export enum Event {
  CONNECTION = "connection",
  JOIN_ROOM = "join_room",
  SEND_MESSAGE = "send_message",
  SEND_MESSAGE_TRANSLATED = "send_message_translated",
}

export type Message = {
  message: string;
  username: string;
  room: string;
  translation?: {
    es: string;
    en: string;
  };
};
