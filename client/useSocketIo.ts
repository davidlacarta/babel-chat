import { useRef, useEffect } from "react";
import io from "socket.io-client";

export default function useSocketIo() {
  const { current: socket } = useRef(io());

  useEffect(() => {
    socket.connect();

    return () => {
      socket && socket.removeAllListeners();
      socket && socket.close();
    };
  }, [socket]);

  return [socket];
}
