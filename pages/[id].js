import React from "react";
import { useRouter } from "next/router";

import Chat from "../components/Chat";
import Layout from "../components/Layout";
import useSocketIo from "../client/useSocketIo";

function chat() {
  const [socket] = useSocketIo();
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <Chat room={id} socket={socket} />
    </Layout>
  );
}

export default chat;
