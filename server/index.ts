import http from "http";
import next from "next";
import GoogleCloudTranslate from "@google-cloud/translate";
import SocketIO from "socket.io";

import translate from "./translate";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;
  const { Translate } = GoogleCloudTranslate.v2;
  const googleCloudTranslate = new Translate({ projectId });

  const server = http.createServer((req, res) => handle(req, res));
  const io = SocketIO(server);

  io.on("connection", (socket) => {
    socket.on("join", (room) => {
      Object.keys(socket.rooms).forEach((room) => socket.leave(room));
      socket.join(room);
    });

    socket.on("send", async (message) => {
      message.translation = {
        es: await translate({
          googleCloudTranslate,
          message: message.message,
          lang: "es",
        }),
        en: await translate({
          googleCloudTranslate,
          message: message.message,
          lang: "en",
        }),
      };

      io.in(message.room).emit("send", message);
    });
  });

  server.listen(port);
  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
