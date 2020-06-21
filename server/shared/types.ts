export type Message = {
  type: MessageType;
  content?: string;
  username?: string;
  translation?: Translation;
};

export enum MessageType {
  TEXT = "text",
  USER_HAS_JOINED = "user_has_joined",
  USER_HAS_DISCONNECTED = "user_has_disconnected",
}

export type Translation = {
  es: string;
  en: string;
};

export type ClientJoinRoom = {
  room: string;
  username: string;
};

export type ServerJoinUser = {
  username: string;
};

export type ServerDisconnectUser = {
  username: string;
};

export type ClientSendMessage = {
  message: Message;
  room: string;
};

export type ServerSendMessage = Message;
