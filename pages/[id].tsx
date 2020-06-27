import React from "react";
import { useRouter } from "next/router";

import Layout from "components/Layout";

function PrivateChat() {
  const router = useRouter();
  const { id } = router.query;

  return <Layout room={id as string} />;
}

export default PrivateChat;
