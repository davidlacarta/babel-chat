export default {
  client: {
    joinRoom: "client:join_room",
    sendMessage: "client:send_message",
    typing: "client:typing",
  },
  server: {
    connection: "connection",
    disconnect: "disconnect",
    sendMessage: "server:send_message",
    joinUser: "server:join_user",
    disconnectUser: "server:disconnect_user",
    typing: "server:typing",
  },
};
