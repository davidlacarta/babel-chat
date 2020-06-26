import { useState, KeyboardEvent, useRef, useEffect } from "react";

import useMessages from "components/Chat/useMessages";
import useLangs from "./useLangs";
import scrollTop from "./helpers/scrollTop";
import clearInput from "./helpers/clearInput";
import { TypingType, MessageType } from "server/shared/types";
import StyledSystem from "styles/StyledSystem";
import styled from "styled-components";
import theme from "styles/theme";

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
    <Grid gridTemplateRows={{ XS: "80px 1fr", SM: "100px 1fr" }} height="100vh">
      <Flex as="header">
        <Flex {...wrapper} justifyContent="space-between" p={{ XS: 2, SM: 3 }}>
          <H1 m={0}>{(room && `🔒 ${room}`) || `Babel`}</H1>
          <Flag onClick={toogleLang}>{lang.flag}</Flag>
        </Flex>
      </Flex>
      <Grid
        as="main"
        gridTemplateRows={{ XS: "1fr 80px", SM: "1fr 100px" }}
        overflow="auto"
      >
        <Flex overflow="auto">
          <Box as="ul" overflowY="auto" pb={4} {...wrapper} ref={messagesRef}>
            {messages.map(
              ({ content, author, translation, type, createdAt }, index) => {
                if (MessageType.TEXT === type) {
                  const isSelf = username === author;
                  return (
                    <Grid
                      as="li"
                      gridTemplateColumns={
                        isSelf ? "auto min-content" : "min-content auto"
                      }
                      gridTemplateAreas={
                        isSelf ? `"message avatar"` : `"avatar message"`
                      }
                      key={index}
                      p={2}
                      gridGap={2}
                    >
                      <Box gridArea="avatar">
                        <Avatar>{author?.slice(0, 3)}</Avatar>
                      </Box>
                      <Message gridArea="message" position="relative">
                        <Text mb={2}>{content}</Text>
                        <Text color="primary">
                          {translation && translation[lang.code]}
                        </Text>
                        <Text
                          as="small"
                          position="absolute"
                          right={2}
                          bottom={2}
                          fontSize={1}
                          color="muted"
                        >
                          {format(createdAt, lang.locale)}
                        </Text>
                      </Message>
                    </Grid>
                  );
                }
                const translated =
                  MessageType.USER_HAS_JOINED === type
                    ? lang.joined(content!)
                    : lang.disconnected(content!);
                return (
                  <Text
                    as="li"
                    key={index}
                    textAlign="center"
                    p={1}
                    dangerouslySetInnerHTML={{
                      __html: `${translated} <small>${format(
                        createdAt,
                        lang.locale
                      )}</small>`,
                    }}
                  />
                );
              }
            )}
            {writtersWithoutMe.length > 0 && (
              <Text textAlign="center">{lang.typing(writtersWithoutMe)}</Text>
            )}
          </Box>
        </Flex>
        <Flex>
          <Grid
            as="form"
            width="100%"
            gridGap={3}
            gridTemplateColumns="auto min-content"
            p={{ XS: 2, SM: 3 }}
            {...wrapper}
            onSubmit={(event: any) => event.preventDefault()}
          >
            <Input
              placeholder={username ? lang.message : lang.username}
              ref={messageRef}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />
            <Button onClick={handleClickAvatar}>{lang.send}</Button>
          </Grid>
        </Flex>
      </Grid>
    </Grid>
  );
}

function format(dateTime: Date, locale: string) {
  const [hours, minutes] = new Date(dateTime)
    .toLocaleTimeString(locale, { hour12: false })
    .split(":");

  return `${hours}:${minutes}`;
}

const wrapper = {
  maxWidth: "800px",
};

const full = {
  width: "100%",
  height: "100%",
};

const center = {
  alignItems: "center",
  justifyContent: "center",
};

const Avatar = StyledSystem(styled.div`
  text-transform: uppercase;
  border-radius: 100%;
  display: flex;
`);
Avatar.defaultProps = {
  ...center,
  backgroundColor: "secondary",
  color: "background",
  fontFamily: "body",
  fontWeight: "bold",
  height: 60,
  width: 60,
};

const Button = StyledSystem(styled.button`
  cursor: pointer;
`);
Button.defaultProps = {
  backgroundColor: "primary",
  color: "background",
  px: 3,
  py: 2,
  borderRadius: 30,
  border: "none",
  fontFamily: "body",
  fontSize: 3,
};

const Flag = StyledSystem(styled.button`
  cursor: pointer;
  background: none;
  border: none;
`);

const Input = StyledSystem(styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid black;
  :focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`);
Input.defaultProps = {
  p: 2,
  fontSize: 3,
  fontFamily: "body",
};

const Message = StyledSystem(styled.div``);
Message.defaultProps = {
  backgroundColor: "gray-1",
  p: 3,
  borderRadius: 20,
};

const Grid = StyledSystem(styled.div`
  display: grid;
`);

const Flex = StyledSystem(styled.div`
  display: flex;
`);
Flex.defaultProps = {
  ...center,
  ...full,
};

const Box = StyledSystem(styled.div``);
Box.defaultProps = {
  ...full,
};

const H1 = StyledSystem(styled.h1``);
H1.defaultProps = {
  ...theme.styles.h1,
};

const Text = StyledSystem(styled.div``);
