import React from "react";
import { MessageType, Message as MessageTyped } from "server/shared/types";
import { Lang } from "i18n/langs";
import MessageText from "./MessageType/Text";
import StatusTime from "./MessageType/StatusTime";

type Props = {
  message: MessageTyped;
  username: string;
  lang: Lang;
};

export default function Message({ message, lang, username }: Props) {
  switch (message.type) {
    case MessageType.USER_HAS_JOINED:
      return (
        <StatusTime
          createdAt={message.createdAt}
          translated={lang.joined(message.content!)}
          lang={lang}
        />
      );
    case MessageType.USER_HAS_DISCONNECTED:
      return (
        <StatusTime
          createdAt={message.createdAt}
          translated={lang.disconnected(message.content!)}
          lang={lang}
        />
      );
    default:
      return <MessageText message={message} username={username} lang={lang} />;
  }
}
