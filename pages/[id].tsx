import React from "react";
import { useRouter } from "next/router";

import Chat from "../components/Chat/Chat";

function PrivateChat() {
  const router = useRouter();
  const { id } = router.query;

  return <Chat room={id as string} />;
}

export default PrivateChat;
