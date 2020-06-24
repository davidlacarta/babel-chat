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
  Text,
  Avatar,
  Paragraph,
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

  const messagesRef = useRef<any>(null);
  const messageRef = useRef<any>(null);

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
    <Grid fill rows={["xsmall", "auto"]} areas={[["header"], ["main"]]}>
      <Header
        justify="center"
        gridArea="header"
        background="dark-1"
        elevation="medium"
      >
        <Box
          direction="row"
          fill="horizontal"
          align="center"
          justify="between"
          width={{ max: "800px" }}
          pad={{ horizontal: "large" }}
        >
          <Heading margin="0">
            {`Babel`}
            {room && (
              <Text
                style={{ marginLeft: "1rem" }}
                margin="0"
              >{`🔒 ${room}`}</Text>
            )}
          </Heading>
          <Button onClick={toogleLang}>{lang.flag}</Button>
        </Box>
      </Header>
      <Main gridArea="main">
        <Grid fill rows={["auto", "xsmall"]} areas={[["messages"], ["input"]]}>
          <Box align="center" gridArea="messages">
            <Box
              pad={{ bottom: "medium" }}
              overflow="auto"
              width={{ max: "800px" }}
              style={{ scrollBehavior: "smooth" }}
              ref={messagesRef}
              fill
            >
              {messages.map(
                ({ content, author, translation, type, createdAt }, index) => {
                  switch (type) {
                    case MessageType.USER_HAS_JOINED:
                      return (
                        <Text
                          textAlign="center"
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html: `${lang.joined(content!)} <small>${format(
                              createdAt,
                              lang.locale
                            )}</small>`,
                          }}
                        ></Text>
                      );
                    case MessageType.USER_HAS_DISCONNECTED:
                      return (
                        <Text
                          key={index}
                          textAlign="center"
                          dangerouslySetInnerHTML={{
                            __html: `${lang.disconnected(
                              content!
                            )} <small>${format(
                              createdAt,
                              lang.locale
                            )}</small>`,
                          }}
                        ></Text>
                      );
                    default:
                      const isSelf = author === username;
                      return (
                        <Grid
                          columns={
                            isSelf
                              ? ["auto", "min-content"]
                              : ["min-content", "auto"]
                          }
                          areas={
                            isSelf
                              ? [["message", "avatar"]]
                              : [["avatar", "message"]]
                          }
                          gap="small"
                          key={index}
                          margin="small"
                        >
                          <Avatar
                            background={isSelf ? "accent-1" : "accent-2"}
                            gridArea={"avatar"}
                            size="large"
                          >
                            {author?.slice(0, 3)}
                          </Avatar>
                          <Box
                            background="light-2"
                            round
                            pad="medium"
                            gridArea={"message"}
                            style={{ position: "relative" }}
                          >
                            <Paragraph margin="none" fill>
                              {content}
                            </Paragraph>
                            <Paragraph
                              fill
                              margin="none"
                              size="small"
                              color="dark-3"
                            >
                              {translation && translation[lang.code]}
                            </Paragraph>
                            <Text
                              size="xsmall"
                              color="dark-3"
                              style={{
                                position: "absolute",
                                right: "1rem",
                                bottom: "1rem",
                              }}
                            >
                              {format(createdAt, lang.locale)}
                            </Text>
                          </Box>
                        </Grid>
                      );
                  }
                }
              )}
              {writtersWithoutMe.length > 0 && (
                <Text textAlign="center">{lang.typing(writtersWithoutMe)}</Text>
              )}
            </Box>
          </Box>
          <Box align="center" gridArea="input" elevation="large">
            <Grid
              as="form"
              columns={["auto", "min-content"]}
              align="center"
              gap="small"
              pad={{ horizontal: "medium" }}
              style={{ maxWidth: "800px" }}
              fill
              onSubmit={(event) => event.preventDefault()}
            >
              <Box fill="horizontal">
                <FormField margin="0">
                  <TextInput
                    placeholder={username ? lang.message : lang.username}
                    ref={messageRef}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                  />
                </FormField>
              </Box>
              <Button
                type="submit"
                primary
                icon={<Send />}
                onClick={handleClickAvatar}
              />
            </Grid>
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
