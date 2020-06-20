import { useState, KeyboardEvent, useRef, useEffect } from "react";

import useMessages from "components/Chat/useMessages";
import useLangs from "./useLangs";
import scrollTop from "./helpers/scrollTop";
import clearInput from "./helpers/clearInput";
import Header from "./Header";
import Messages from "./Messages";
import Footer from "./Footer";

export type Props = {
  room?: string;
};

export default function Chat({ room }: Props) {
  const [username, setUsername] = useState<string | undefined>();
  const { lang, toogle: toogleLang } = useLangs();
  const { messages, send: sendMessage } = useMessages({
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
    if (key !== "Enter" || !text) {
      return;
    }

    send(text);
  }

  function send(text: string) {
    clearInput(messageRef);

    if (!username) {
      setUsername(text);
      return;
    }

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
        />
        <Footer
          username={username}
          lang={lang}
          messageRef={messageRef}
          handleKeyDown={handleKeyDown}
          handleClickAvatar={handleClickAvatar}
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
