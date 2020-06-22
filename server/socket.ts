import SocketIO from "socket.io";
import GoogleCloudTranslate from "@google-cloud/translate";
import { Server } from "http";

import { translate } from "./translation";
import {
  ClientSendMessage,
  ClientJoinRoom,
  ServerJoinUser,
  ServerSendMessage,
  ServerDisconnectUser,
  ClientTyping,
  ServerTyping,
  TypingType,
} from "./shared/types";
import Event from "./shared/Event";

export default { create };

function create(server: Server) {
  const socketIO = SocketIO(server);
  const googleCloudTranslate = createGoogleCloudTranslate();

  socketIO.on(Event.server.connection, (socket: SocketIO.Socket) => {
    const session = {
      rooms: [] as string[],
      username: null as string | null,
    };

    socket.on(Event.client.joinRoom, ({ room, username }: ClientJoinRoom) => {
      Object.keys(socket.rooms).forEach((room) => socket.leave(room));

      socket.join(room);

      session.rooms.push(room);
      session.username = username;

      const serverJoinUser: ServerJoinUser = { username, at: new Date() };

      socketIO.in(room).emit(Event.server.joinUser, serverJoinUser);
    });

    socket.on(
      Event.client.sendMessage,
      async ({ message, room }: ClientSendMessage) => {
        const [es, en] = [
          await translate({
            googleCloudTranslate,
            message: message.content!,
            lang: "es",
          }),
          await translate({
            googleCloudTranslate,
            message: message.content!,
            lang: "en",
          }),
        ];

        const messageTranslated: ServerSendMessage = {
          ...message,
          translation: { es, en },
        };

        socketIO.in(room).emit(Event.server.sendMessage, messageTranslated);
      }
    );

    socket.on(Event.server.disconnect, () => {
      const serverDisconnectUser: ServerDisconnectUser = {
        username: session.username!,
        at: new Date(),
      };

      const serverTyping: ServerTyping = {
        at: new Date(),
        username: session.username!,
        type: TypingType.STOP,
      };

      [...session.rooms].forEach((room) =>
        socketIO
          .in(room)
          .emit(Event.server.disconnectUser, serverDisconnectUser)
      );
      [...session.rooms].forEach((room) =>
        socketIO.in(room).emit(Event.server.typing, serverTyping)
      );
    });

    socket.on(Event.client.typing, ({ at, room, type }: ClientTyping) => {
      const serverTyping: ServerTyping = {
        at,
        username: session.username!,
        type,
      };

      socketIO.in(room).emit(Event.server.typing, serverTyping);
    });
  });
}

function createGoogleCloudTranslate() {
  const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;

  return new GoogleCloudTranslate.v2.Translate({ projectId });
}
