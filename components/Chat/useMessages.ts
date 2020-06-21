import { useEffect, useState } from "react";
import io from "socket.io-client";
import Event from "../../server/shared/Event";
import { Message } from "../../server/shared/types";

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
    socket?.emit(Event.client.joinRoom, room);
  }, [socket, room]);

  useEffect(() => {
    socket?.on(Event.server.sendMessage, (message: Message) => {
      setMessages((messages) => {
        if (messages.length + 1 > MAX_MESSAGES + MAX_MESSAGES_MARGIN) {
          setTimeout(() => {
            setMessages((messages) =>
              messages.slice(messages.length - MAX_MESSAGES)
            );
          }, 1000);
        }

        return [...messages, message];
      });
    });
  }, [socket]);

  function send(text: string) {
    socket?.emit(Event.client.sendMessage, {
      message: text,
      username: username,
      room,
    });
  }

  return { messages, send };
}
