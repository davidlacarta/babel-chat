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
import { Translate } from "@google-cloud/translate/build/src/v2";

export default { create };

function create(server: Server) {
  const socketIO = SocketIO(server);
  const googleCloudTranslate = createGoogleCloudTranslate();

  socketIO.on(Event.server.connection, (socket: SocketIO.Socket) => {
    const session = {
      rooms: [] as string[],
      username: null as string | null,
    };

    const withContext = (func: any) =>
      func({ socket, socketIO, session, googleCloudTranslate });

    socket.on(Event.client.joinRoom, withContext(onClientJoinRoom));
    socket.on(Event.client.sendMessage, withContext(onClientSendMessage));
    socket.on(Event.server.disconnect, withContext(onServerDisconnect));
    socket.on(Event.client.typing, withContext(onClientTyping));
  });
}

const onClientJoinRoom = ({ socket, socketIO, session }: Context) => ({
  room,
  username,
}: ClientJoinRoom) => {
  Object.keys(socket.rooms).forEach((room) => socket.leave(room));

  socket.join(room);

  session.rooms.push(room);
  session.username = username;

  const serverJoinUser: ServerJoinUser = { username, at: new Date() };

  socketIO.in(room).emit(Event.server.joinUser, serverJoinUser);
};

const onClientSendMessage = ({
  socketIO,
  googleCloudTranslate,
}: Context) => async ({ message, room }: ClientSendMessage) => {
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
};

const onServerDisconnect = ({ socketIO, session }: Context) => () => {
  const serverDisconnectUser: ServerDisconnectUser = {
    username: session.username!,
    at: new Date(),
  };

  const serverTyping: ServerTyping = {
    at: new Date(),
    username: session.username!,
    type: TypingType.STOP,
  };

  [...session.rooms].forEach((room) => {
    socketIO.in(room).emit(Event.server.disconnectUser, serverDisconnectUser);

    socketIO.in(room).emit(Event.server.typing, serverTyping);
  });
};

const onClientTyping = ({ socketIO, session }: Context) => ({
  at,
  room,
  type,
}: ClientTyping) => {
  const serverTyping: ServerTyping = {
    at,
    username: session.username!,
    type,
  };

  socketIO.in(room).emit(Event.server.typing, serverTyping);
};

function createGoogleCloudTranslate() {
  const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;

  return new GoogleCloudTranslate.v2.Translate({ projectId });
}

type Context = {
  socket: SocketIO.Socket;
  socketIO: SocketIO.Server;
  session: {
    rooms: string[];
    username: string | null;
  };
  googleCloudTranslate: Translate;
};
