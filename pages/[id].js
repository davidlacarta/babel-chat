import React from "react";
import { useRouter } from "next/router";

import Chat from "../components/Chat";
import Layout from "../components/Layout";

function chat() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <Chat room={id} />
    </Layout>
  );
}

export default chat;
