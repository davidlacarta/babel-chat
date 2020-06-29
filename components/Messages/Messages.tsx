import React, { useEffect, useRef } from "react";
import { Box } from "grommet";
import { Message as MessageTyped } from "server/shared/types";
import useUsername from "state/useUsername";
import useLangs from "state/useLangs";
import scrollTop from "../helpers/scrollTop";
import { Lang } from "i18n/langs";
import Message from "./Message";
import Status from "./MessageType/Status";

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

type UsersTypingProps = {
  writters: Array<string>;
  username: string;
  lang: Lang;
};

function UsersTyping({ writters, username, lang }: UsersTypingProps) {
  const writtersWithoutMe = writters.filter((writter) => writter !== username);
  const html =
    writtersWithoutMe.length > 0 ? lang.typing(writtersWithoutMe) : "";

  return <Status html={html} style={{ minHeight: "2rem" }} />;
}
