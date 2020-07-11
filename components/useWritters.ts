import { useEffect, useState } from "react";
import Event from "../server/shared/Event";
import { TypingType, ClientTyping, ServerTyping } from "../server/shared/types";
import useSocket from "state/useSocket";

type Props = {
  room: string;
  username?: string;
};

export default function useWritters({ room, username }: Props) {
  const socket = useSocket();
  const [writters, setWritters] = useState<Array<string>>([]);

  useEffect(() => {
    function updateWrittersOnServerTyping() {
      socket.on(Event.server.typing, ({ username, type }: ServerTyping) => {
        setWritters((writters) =>
          TypingType.START === type
            ? [...new Set([...writters, username])]
            : writters.filter((writter) => writter !== username)
        );
      });
    }

    updateWrittersOnServerTyping();
  }, [socket]);

  useEffect(() => {
    function emitTypingStopEach({ seconds }: { seconds: number }) {
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

        socket.emit(Event.client.typing, clientTyping);
      }, seconds * 1000);
    }

    emitTypingStopEach({ seconds: 5 });
  }, [writters]);

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

    socket.emit(Event.client.typing, clientTyping);
  }

  return { writters, typing };
}
