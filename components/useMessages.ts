import { useEffect, useState } from "react";
import Event from "../server/shared/Event";
import {
  Message,
  ServerSendMessage,
  ServerJoinUser,
  MessageType,
  ServerDisconnectUser,
  ClientSendMessage,
} from "../server/shared/types";
import useSocket from "state/useSocket";

const MAX_MESSAGES = 100;
const MAX_MESSAGES_MARGIN = 10;

type Props = {
  room: string;
  username?: string;
};

export default function useMessages({ room, username }: Props) {
  const socket = useSocket();
  const [messages, setMessages] = useState<Array<Message>>([]);

  function addMessage({
    username,
    at,
    type,
  }: {
    username: string;
    at: Date;
    type: MessageType;
  }) {
    const message: Message = {
      content: username,
      createdAt: at,
      type,
    };

    setMessages((messages) => [...messages, message]);
  }

  useEffect(() => {
    if (username) {
      socket.emit(Event.client.joinRoom, { room, username });
    }
  }, [socket, room, username]);

  useEffect(() => {
    socket.on(Event.server.sendMessage, (message: ServerSendMessage) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on(Event.server.joinUser, ({ username, at }: ServerJoinUser) => {
      addMessage({ username, at, type: MessageType.USER_HAS_JOINED });
    });

    socket.on(
      Event.server.disconnectUser,
      ({ username, at }: ServerDisconnectUser) => {
        addMessage({ username, at, type: MessageType.USER_HAS_DISCONNECTED });
      }
    );
  }, [socket]);

  useEffect(() => {
    const messagesLimitExceded =
      messages.length + 1 > MAX_MESSAGES + MAX_MESSAGES_MARGIN;

    if (messagesLimitExceded) {
      setTimeout(() => {
        setMessages((messages) =>
          messages.slice(messages.length - MAX_MESSAGES)
        );
      }, 1000);
    }
  }, [messages]);

  function send(text: string) {
    const clientSendMessage: ClientSendMessage = {
      message: {
        type: MessageType.TEXT,
        content: text,
        createdAt: new Date(),
        author: username,
      },
      room,
    };

    socket.emit(Event.client.sendMessage, clientSendMessage);
  }

  return { messages, send };
}
