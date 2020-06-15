const http = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("message", (message) => {
      socket.broadcast.emit("message", message);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
