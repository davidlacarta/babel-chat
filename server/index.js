const http = require("http");
const next = require("next");

const translate = require("./translate");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;
  const { Translate } = require("@google-cloud/translate").v2;
  const googleCloudTranslate = new Translate({ projectId });

  const server = http.createServer((req, res) => handle(req, res));
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("message", async (message) => {
      message.translation = await translate({
        googleCloudTranslate,
        message: message.message,
        lang: "es",
      });

      socket.broadcast.emit("message", message);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
