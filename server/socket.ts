import SocketIO from "socket.io";
import GoogleCloudTranslate from "@google-cloud/translate";
import { Server } from "http";

import { translate } from "./translation";
import { Event, Message } from "../shared/types";

export default { create };

function create(server: Server) {
  const socketIO = SocketIO(server);
  const googleCloudTranslate = createGoogleCloudTranslate();

  socketIO.on(Event.CONNECTION, (socket: SocketIO.Socket) => {
    socket.on(Event.JOIN_ROOM, (room: string) => {
      Object.keys(socket.rooms).forEach((room) => socket.leave(room));
      socket.join(room);
    });

    socket.on(Event.SEND_MESSAGE, async (message: Message) => {
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
        .emit(Event.SEND_MESSAGE_TRANSLATED, messageTranslated);
    });
  });
}

function createGoogleCloudTranslate() {
  const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;

  return new GoogleCloudTranslate.v2.Translate({ projectId });
}
