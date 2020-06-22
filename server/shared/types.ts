export type Message = {
  type: MessageType;
  createdAt: Date;
  content?: string;
  author?: string;
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
  at: Date;
};

export type ServerDisconnectUser = {
  username: string;
  at: Date;
};

export type ClientSendMessage = {
  message: Message;
  room: string;
};

export type ClientTyping = {
  at: Date;
  type: TypingType;
  room: string;
};

export type ServerTyping = {
  at: Date;
  username: string;
  type: TypingType;
};

export enum TypingType {
  START = "start",
  STOP = "stop",
}

export type ServerSendMessage = Message;
