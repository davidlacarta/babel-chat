import { useEffect, useState } from "react";
import io from "socket.io-client";
import Event from "../../server/shared/Event";
import {
  Message,
  ServerSendMessage,
  ServerJoinUser,
  MessageType,
  ServerDisconnectUser,
  ClientSendMessage,
  TypingType,
  ClientTyping,
  ServerTyping,
} from "../../server/shared/types";

const MAX_MESSAGES = 100;
const MAX_MESSAGES_MARGIN = 10;

type Props = {
  room?: string;
  username?: string;
};

export default function useMessages({ room = "general", username }: Props) {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [writters, setWritters] = useState<Array<string>>([]);

  useEffect(() => {
    const socketIo = io();

    setSocket(socketIo);

    return () => {
      socketIo.removeAllListeners();
      socketIo.close();
    };
  }, []);

  useEffect(() => {
    if (username) {
      socket?.emit(Event.client.joinRoom, { room, username });
    }
  }, [socket, room, username]);

  useEffect(() => {
    socket?.on(Event.server.sendMessage, (message: ServerSendMessage) => {
      setMessages((messages) => [...messages, message]);
    });

    socket?.on(Event.server.joinUser, ({ username, at }: ServerJoinUser) => {
      const message: Message = {
        content: username,
        createdAt: at,
        type: MessageType.USER_HAS_JOINED,
      };

      setMessages((messages) => [...messages, message]);
    });

    socket?.on(
      Event.server.disconnectUser,
      ({ username, at }: ServerDisconnectUser) => {
        const message = {
          content: username,
          createdAt: at,
          type: MessageType.USER_HAS_DISCONNECTED,
        };

        setMessages((messages) => [...messages, message]);
      }
    );

    socket?.on(Event.server.typing, ({ username, type }: ServerTyping) => {
      setWritters((writters) =>
        TypingType.START === type
          ? [...new Set([...writters, username])]
          : writters.filter((writter) => writter !== username)
      );
    });
  }, [socket]);

  useEffect(() => {
    const isWritting = writters.find((writter) => writter === username);
    if (!isWritting) {
      return;
    }
    setTimeout(() => {
      const isWritting = writters.find((writter) => writter === username);
      if (!isWritting) {
        return;
      }
      const clientTyping: ClientTyping = {
        at: new Date(),
        type: TypingType.STOP,
        room,
      };

      socket?.emit(Event.client.typing, clientTyping);
    }, 5000);
  }, [writters]);

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

    socket?.emit(Event.client.sendMessage, clientSendMessage);
  }

  function typing(type: TypingType) {
    const isWritting = writters.find((writter) => writter === username);
    if (
      (TypingType.START === type && isWritting) ||
      (TypingType.STOP === type && !isWritting)
    ) {
      return;
    }

    const clientTyping: ClientTyping = {
      at: new Date(),
      type,
      room,
    };

    socket?.emit(Event.client.typing, clientTyping);
  }

  return { messages, writters, send, typing };
}
