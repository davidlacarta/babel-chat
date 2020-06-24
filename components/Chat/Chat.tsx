import { useState, KeyboardEvent, useRef, useEffect } from "react";

import useMessages from "components/Chat/useMessages";
import useLangs from "./useLangs";
import scrollTop from "./helpers/scrollTop";
import clearInput from "./helpers/clearInput";
import { TypingType, MessageType } from "server/shared/types";
import { Send } from "grommet-icons";
import {
  Header,
  Main,
  Heading,
  Grid,
  Box,
  Button,
  TextInput,
  FormField,
} from "grommet";

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
    <Grid fill rows={["xsmall", "auto"]}>
      <Header>
        <Box
          direction="row"
          fill="horizontal"
          align="center"
          alignContent="center"
        >
          <Heading>{(room && `🔒 ${room}`) || `Babel`}</Heading>
          <span>{username?.slice(0, 3)}</span>
          <button onClick={toogleLang}>{lang.flag}</button>
        </Box>
      </Header>
      <Main>
        <Grid fill rows={["auto", "xsmall"]}>
          <Box background="light-3" overflow="auto" round margin="medium">
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
                            __html: `${lang.disconnected(
                              content!
                            )} <small>${format(
                              createdAt,
                              lang.locale
                            )}</small>`,
                          }}
                        ></li>
                      );
                    default:
                      return (
                        <li key={index}>
                          <span>{author?.slice(0, 3)}</span>
                          <span>{content}</span>
                          <small>{translation && translation[lang.code]}</small>
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
          </Box>
          <Box
            direction="row"
            margin={{ horizontal: "medium", vertical: "small" }}
            pad="medium"
            align="center"
            gap="medium"
            as="form"
            width={{ max: "800px" }}
            onSubmit={(event) => event.preventDefault()}
          >
            <FormField fill="horizontal" margin="0">
              <TextInput
                placeholder={username ? lang.message : lang.username}
                ref={messageRef}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
              />
            </FormField>
            <Box align="center">
              <Button
                type="submit"
                primary
                icon={<Send />}
                onClick={handleClickAvatar}
              />
            </Box>
          </Box>
        </Grid>
      </Main>
    </Grid>
  );
}

function format(dateTime: Date, locale: string) {
  const [hours, minutes] = new Date(dateTime)
    .toLocaleTimeString(locale, { hour12: false })
    .split(":");

  return `${hours}:${minutes}`;
}
