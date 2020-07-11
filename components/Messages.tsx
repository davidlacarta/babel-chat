import React, { useEffect, useRef } from "react";
import { Box } from "grommet";
import useUsername from "state/useUsername";
import useLangs from "state/useLangs";
import scrollTop from "./helpers/scrollTop";
import { Lang } from "i18n/langs";
import { MessageType, Message as MessageTyped } from "server/shared/types";
import TextMessage from "./message/Text";
import StatusMessage from "./message/Status";
import UsersTyping from "./UsersTyping";

type Props = {
  messages: Array<MessageTyped>;
  writters: Array<string>;
};

export default function Messages({ messages, writters }: Props) {
  const { username } = useUsername();
  const { lang } = useLangs();

  const messagesRef = useRef<any>(null);

  useEffect(() => {
    scrollTop(messagesRef);
  }, [messages]);

  return (
    <Box
      pad={{ top: "medium" }}
      overflow="auto"
      width={{ max: "800px" }}
      style={{ scrollBehavior: "smooth" }}
      ref={messagesRef}
      fill
    >
      {messages.map((message, index) => (
        <Message
          key={message?.createdAt?.toString() ?? index}
          lang={lang}
          message={message}
          username={username}
        />
      ))}
      <UsersTyping writters={writters} username={username} lang={lang} />
    </Box>
  );
}

function Message({
  message,
  lang,
  username,
}: {
  message: MessageTyped;
  username: string;
  lang: Lang;
}) {
  return message.type === MessageType.TEXT ? (
    <TextMessage message={message} username={username} lang={lang} />
  ) : (
    <StatusMessage
      createdAt={message.createdAt}
      translated={
        message.type === MessageType.USER_HAS_JOINED
          ? lang.joined(message.content!)
          : lang.disconnected(message.content!)
      }
      lang={lang}
    />
  );
}
