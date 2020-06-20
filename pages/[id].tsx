import React from "react";
import { useRouter } from "next/router";

import Chat from "../components/Chat/Chat";
import Layout from "../components/Layout";

function chat() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <Chat room={id as string} />
    </Layout>
  );
}

export default chat;
