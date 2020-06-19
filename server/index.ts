import http from "http";
import next from "next";
import socket from "./socket";

const dev = process.env.NODE_ENV !== "production";
const environment = dev ? "development" : process.env.NODE_ENV;
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));

  socket.create(server);

  server.listen(port);

  // tslint:disable-next-line:no-console
  console.log(`> Server at http://localhost:${port} as ${environment}`);
});
