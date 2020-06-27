import { KeyboardEvent, useRef, useEffect, useContext } from "react";

import useMessages from "components/Chat/useMessages";
import useLangs from "../../state/useLangs";
import scrollTop from "./helpers/scrollTop";
import clearInput from "./helpers/clearInput";
import { TypingType, MessageType } from "server/shared/types";
import { Send } from "grommet-icons";
import {
  Main,
  Grid,
  Box,
  Button,
  TextInput,
  FormField,
  Text,
  Avatar,
  Paragraph,
  ResponsiveContext,
} from "grommet";
import useUsername from "state/useUsername";
import ChatHeader from "components/Header";
import UsernameForm from "components/UsernameForm";

export type Props = {
  room?: string;
};

export default function Chat({ room = "general" }: Props) {
  const { username } = useUsername();
  const { lang } = useLangs();
  const { messages, writters, send: sendMessage, typing } = useMessages({
    room,
    username,
  });
  const size = useContext(ResponsiveContext);

  const messagesRef = useRef<any>(null);
  const messageRef = useRef<any>(null);

  useEffect(() => {
    scrollTop(messagesRef);
  }, [messages]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, [username]);

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
      typing(TypingType.STOP);
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
    typing(TypingType.STOP);
  }

  function send(text: string) {
    clearInput(messageRef);

    typing(TypingType.STOP);
    sendMessage(text);
  }

  if (!username) {
    return (
      <Grid fill rows={["xsmall", "auto"]} areas={[["header"], ["main"]]}>
        <ChatHeader room={room} />
        <Main gridArea="main">
          <UsernameForm />
        </Main>
      </Grid>
    );
  }

  const writtersWithoutMe = writters.filter((writter) => writter !== username);

  return (
    <Grid fill rows={["xsmall", "auto"]} areas={[["header"], ["main"]]}>
      <ChatHeader room={room} />
      <Main gridArea="main">
        <Grid fill areas={[["messages"], ["input"]]} rows={["auto", "xsmall"]}>
          <Box align="center" gridArea="messages">
            <Box
              pad={{ top: "medium" }}
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
                          size="small"
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
                          size="small"
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
                          justifyContent={isSelf ? "end" : "start"}
                          gap="small"
                          key={index}
                          margin="medium"
                        >
                          <Avatar
                            background={isSelf ? "accent-1" : "accent-2"}
                            gridArea={"avatar"}
                            size={size === "small" ? "medium" : "large"}
                          >
                            {author?.slice(0, 3)}
                          </Avatar>
                          <Box
                            background="light-2"
                            round
                            pad="medium"
                            gridArea={"message"}
                            style={{
                              position: "relative",
                              paddingRight: "3rem",
                            }}
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
                                right: size === "small" ? "0.7rem" : "1rem",
                                bottom: size === "small" ? "0.7rem" : "1rem",
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
              <Text
                textAlign="center"
                size="small"
                style={{ minHeight: "2rem" }}
              >
                {writtersWithoutMe.length > 0 && lang.typing(writtersWithoutMe)}
              </Text>
            </Box>
          </Box>
          <Box align="center" gridArea="input">
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
