import { useRef, useEffect } from "react";
import io from "socket.io-client";

export default function useSocketIo(...args) {
  const { current: socket } = useRef(io(...args));

  useEffect(() => {
    socket.connect();

    return () => {
      socket && socket.removeAllListeners();
      socket && socket.close();
    };
  }, [socket]);

  return [socket];
}
