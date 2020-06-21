import SocketIO from "socket.io";
import GoogleCloudTranslate from "@google-cloud/translate";
import { Server } from "http";

import { translate } from "./translation";
import { Message } from "./shared/types";
import Event from "./shared/Event";

export default { create };

function create(server: Server) {
  const socketIO = SocketIO(server);
  const googleCloudTranslate = createGoogleCloudTranslate();

  socketIO.on(Event.server.connection, (socket: SocketIO.Socket) => {
    socket.on(Event.client.joinRoom, (room: string) => {
      Object.keys(socket.rooms).forEach((room) => socket.leave(room));
      socket.join(room);
    });

    socket.on(Event.client.sendMessage, async (message: Message) => {
      const [es, en] = [
        await translate({
          googleCloudTranslate,
          message: message.message,
          lang: "es",
        }),
        await translate({
          googleCloudTranslate,
          message: message.message,
          lang: "en",
        }),
      ];

      const messageTranslated = { ...message, translation: { es, en } };

      socketIO
        .in(message.room)
        .emit(Event.server.sendMessage, messageTranslated);
    });
  });
}

function createGoogleCloudTranslate() {
  const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;

  return new GoogleCloudTranslate.v2.Translate({ projectId });
}
