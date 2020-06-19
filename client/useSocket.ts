import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const socketIo = io();

    setSocket(socketIo);

    return () => {
      socketIo.removeAllListeners();
      socketIo.close();
    };
  }, []);

  return socket;
}
