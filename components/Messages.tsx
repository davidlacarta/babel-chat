import React, { useEffect, useRef, useContext } from "react";
import { Grid, Text, Box, Avatar, Paragraph, ResponsiveContext } from "grommet";
import { MessageType, Message as MessageTyped } from "server/shared/types";
import useUsername from "state/useUsername";
import useLangs from "state/useLangs";
import scrollTop from "./helpers/scrollTop";
import formatTime from "./helpers/formatTime";
import formatAvatar from "./helpers/formatAvatar";
import { Lang } from "i18n/langs";

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
    <Container messagesRef={messagesRef}>
      {messages.map(
        ({ content, author, translation, type, createdAt }, index) => (
          <Message
            key={createdAt ?? index}
            content={content}
            author={author}
            translation={translation}
            type={type}
            createdAt={createdAt}
            lang={lang}
            username={username}
          />
        )
      )}
      <MessageWritters writters={writters} username={username} lang={lang} />
    </Container>
  );
}

function Message({
  content,
  author,
  translation,
  type,
  createdAt,
  lang,
  username,
}: any) {
  switch (type) {
    case MessageType.USER_HAS_JOINED:
      return (
        <MessageJoined content={content} createdAt={createdAt} lang={lang} />
      );
    case MessageType.USER_HAS_DISCONNECTED:
      return (
        <MessageDisconnected
          content={content}
          createdAt={createdAt}
          lang={lang}
        />
      );
    default:
      return (
        <MessageText
          author={author}
          username={username}
          content={content}
          translation={translation}
          lang={lang}
          createdAt={createdAt}
        />
      );
  }
}

function MessageText({
  author,
  username,
  content,
  translation,
  lang,
  createdAt,
}: any) {
  const size = useContext(ResponsiveContext);
  const isSelf = author === username;

  return (
    <MessageContainer isAuthor={isSelf}>
      <UserAvatar isAuthor={isSelf} size={size}>
        {formatAvatar(author)}
      </UserAvatar>
      <MessageTextContainer>
        <MessageContent>{content}</MessageContent>
        <MessageTranslation>
          {translation && translation[lang.code]}
        </MessageTranslation>
        <MessageTime size={size}>
          {formatTime(createdAt, lang.locale)}
        </MessageTime>
      </MessageTextContainer>
    </MessageContainer>
  );
}

const Container = ({ children, messagesRef }: any) => (
  <Box
    pad={{ top: "medium" }}
    overflow="auto"
    width={{ max: "800px" }}
    style={{ scrollBehavior: "smooth" }}
    ref={messagesRef}
    fill
  >
    {children}
  </Box>
);

const MessageContainer = ({ children, isAuthor }: any) => (
  <Box animation="fadeIn" style={{ minHeight: "auto" }}>
    <Grid
      columns={isAuthor ? ["auto", "min-content"] : ["min-content", "auto"]}
      areas={isAuthor ? [["message", "avatar"]] : [["avatar", "message"]]}
      justifyContent={isAuthor ? "end" : "start"}
      gap="small"
      margin="medium"
    >
      {children}
    </Grid>
  </Box>
);

const UserAvatar = ({ children, isAuthor, size }: any) => (
  <Avatar
    background={isAuthor ? "accent-1" : "accent-2"}
    gridArea={"avatar"}
    size={size === "small" ? "medium" : "large"}
  >
    <Text size={size === "small" ? "medium" : "large"}>{children}</Text>
  </Avatar>
);

const MessageTextContainer = ({ children }: any) => (
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
    {children}
  </Box>
);

const MessageContent = ({ children }: any) => (
  <Paragraph margin="none" fill>
    {children}
  </Paragraph>
);

const MessageTranslation = ({ children }: any) => (
  <Paragraph fill margin="none" size="small" color="dark-3">
    {children}
  </Paragraph>
);

const MessageTime = ({ children, size }: any) => (
  <Text
    size="xsmall"
    color="dark-3"
    style={{
      position: "absolute",
      right: size === "small" ? "0.7rem" : "1rem",
      bottom: size === "small" ? "0.7rem" : "1rem",
    }}
  >
    {children}
  </Text>
);

function MessageStatus({ html, style }: any) {
  return (
    <Text
      textAlign="center"
      size="small"
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function MessageStatusTime({ translated, createdAt, lang }: any) {
  return (
    <MessageStatus
      html={`${translated} <small>${formatTime(
        createdAt,
        lang.locale
      )}</small>`}
    />
  );
}

function MessageJoined({ content, createdAt, lang }: any) {
  return (
    <MessageStatusTime
      translated={lang.joined(content!)}
      createdAt={createdAt}
      lang={lang}
    />
  );
}

function MessageDisconnected({ content, createdAt, lang }: any) {
  return (
    <MessageStatusTime
      translated={lang.disconnected(content!)}
      createdAt={createdAt}
      lang={lang}
    />
  );
}

function MessageWritters({
  writters,
  username,
  lang,
}: {
  writters: Array<string>;
  username: string;
  lang: Lang;
}) {
  const writtersWithoutMe = writters.filter((writter) => writter !== username);

  return (
    <MessageStatus
      html={writtersWithoutMe.length > 0 ? lang.typing(writtersWithoutMe) : ""}
      style={{ minHeight: "2rem" }}
    ></MessageStatus>
  );
}
