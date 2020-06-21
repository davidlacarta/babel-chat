import { useEffect, useState } from "react";
import io from "socket.io-client";
import Event from "../../server/shared/Event";
import {
  Message,
  ServerSendMessage,
  ServerJoinUser,
  MessageType,
  ServerDisconnectUser,
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

    socket?.on(Event.server.joinUser, ({ username }: ServerJoinUser) => {
      const message = { content: username, type: MessageType.USER_HAS_JOINED };

      setMessages((messages) => [...messages, message]);
    });

    socket?.on(
      Event.server.disconnectUser,
      ({ username }: ServerDisconnectUser) => {
        const message = {
          content: username,
          type: MessageType.USER_HAS_DISCONNECTED,
        };

        setMessages((messages) => [...messages, message]);
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
    socket?.emit(Event.client.sendMessage, {
      message: {
        content: text,
        username,
      },
      room,
    });
  }

  return { messages, send };
}
