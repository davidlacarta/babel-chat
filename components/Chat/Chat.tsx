import { useState, KeyboardEvent, useRef, useEffect } from "react";

import useMessages from "components/Chat/useMessages";
import useLangs from "./useLangs";
import scrollTop from "./helpers/scrollTop";
import clearInput from "./helpers/clearInput";
import Header from "./Header";
import Messages from "./Messages";
import Footer from "./Footer";
import { TypingType } from "server/shared/types";

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

  return (
    <>
      <div className="chat_window">
        <Header
          username={username}
          room={room}
          lang={lang}
          toogleLang={toogleLang}
        />
        <Messages
          username={username}
          lang={lang}
          messagesRef={messagesRef}
          messages={messages}
          writters={writters}
        />
        <Footer
          username={username}
          lang={lang}
          messageRef={messageRef}
          handleKeyDown={handleKeyDown}
          handleClickAvatar={handleClickAvatar}
          handleBlur={handleBlur}
        />
      </div>
      <style jsx>{`
        .chat_window {
          position: absolute;
          width: 100%;
          max-width: 800px;
          height: 100%;
          border-radius: 10px;
          background-color: #fff;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          background-color: #f8f8f8;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
