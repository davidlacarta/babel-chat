import { useState, KeyboardEvent, useRef, useEffect } from "react";

import useMessages from "components/Chat/useMessages";
import useLangs from "./useLangs";
import scrollTop from "./helpers/scrollTop";
import clearInput from "./helpers/clearInput";
import { TypingType, MessageType } from "server/shared/types";

export type Props = {
  room?: string;
};

export default function Chat({ room }: Props) {
  const [username, setUsername] = useState<string | undefined>();
  const { lang, toogle: toogleLang } = useLangs();
  const { messages, writters, send: sendMessage, typing } = useMessages({
    room,
    username,
  });

  const messagesRef = useRef<HTMLUListElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollTop(messagesRef);
  }, [messages]);

  function handleClickAvatar() {
    if (!messageRef?.current?.value) {
      return;
    }

    send(messageRef.current.value);
  }

  function handleKeyDown({
    key,
    currentTarget: { value: text },
  }: KeyboardEvent<HTMLInputElement>) {
    if (!text) {
      if (username) {
        typing(TypingType.STOP);
      }
      return;
    }

    if (username) {
      typing(TypingType.START);
    }

    if (key !== "Enter") {
      return;
    }

    send(text);
  }

  function handleBlur() {
    if (username) {
      typing(TypingType.STOP);
    }
  }

  function send(text: string) {
    clearInput(messageRef);

    if (!username) {
      setUsername(text);
      return;
    }

    typing(TypingType.STOP);
    sendMessage(text);
  }

  const writtersWithoutMe = writters.filter((writter) => writter !== username);

  return (
    <div>
      <h1>{(room && `🔒 ${room}`) || `Babel`}</h1>
      <button onClick={toogleLang}>{lang.flag}</button>
      <ul ref={messagesRef}>
        {messages.map(
          ({ content, author, translation, type, createdAt }, index) => {
            switch (type) {
              case MessageType.USER_HAS_JOINED:
                return (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: `${lang.joined(content!)} <small>${format(
                        createdAt,
                        lang.locale
                      )}</small>`,
                    }}
                  ></li>
                );
              case MessageType.USER_HAS_DISCONNECTED:
                return (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: `${lang.disconnected(content!)} <small>${format(
                        createdAt,
                        lang.locale
                      )}</small>`,
                    }}
                  ></li>
                );
              default:
                return (
                  <li key={index}>
                    <div>{author?.slice(0, 3)}</div>
                    <div>{content}</div>
                    <div>{translation && translation[lang.code]}</div>
                    <span>{format(createdAt, lang.locale)}</span>
                  </li>
                );
            }
          }
        )}
        {writtersWithoutMe.length > 0 && (
          <li>{lang.typing(writtersWithoutMe)}</li>
        )}
      </ul>
      <input
        placeholder={username ? lang.message : lang.username}
        ref={messageRef}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <button onClick={handleClickAvatar}>{lang.send}</button>
    </div>
  );
}

function format(dateTime: Date, locale: string) {
  const [hours, minutes] = new Date(dateTime)
    .toLocaleTimeString(locale, { hour12: false })
    .split(":");

  return `${hours}:${minutes}`;
}
