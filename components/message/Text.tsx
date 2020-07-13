import React, { useContext } from "react";
import { Grid, Text, Box, Avatar, Paragraph, ResponsiveContext } from "grommet";
import { Message } from "server/shared/types";
import { Lang } from "i18n/langs";
import formatAvatar from "components/helpers/formatAvatar";
import formatTime from "components/helpers/formatTime";
import autoTranslate from "components/helpers/autoTranslate";

type Props = {
  message: Message;
  username: string;
  lang: Lang;
};

export default function TextMessage({ message, username, lang }: Props) {
  const size = useContext(ResponsiveContext);
  const isAuthor = message.author === username;

  return (
    <Box style={{ minHeight: "auto" }}>
      <Grid
        areas={isAuthor ? [["message", "avatar"]] : [["avatar", "message"]]}
        rows={["auto"]}
        columns={isAuthor ? ["auto", "min-content"] : ["min-content", "auto"]}
        justifyContent={isAuthor ? "end" : "start"}
        gap="small"
        margin="medium"
      >
        <Avatar
          gridArea={"avatar"}
          background={isAuthor ? "accent-4" : "accent-1"}
          size={size === "small" ? "medium" : "large"}
        >
          <Text size={size === "small" ? "medium" : "large"} color="dark-1">
            {formatAvatar(message.author!)}
          </Text>
        </Avatar>
        <MessageBox gridArea="message" message={message} lang={lang} />
      </Grid>
    </Box>
  );
}

function MessageBox({
  gridArea,
  message: { createdAt, content, translation },
  lang,
}: {
  gridArea: string;
  message: Message;
  lang: Lang;
}) {
  const size = useContext(ResponsiveContext);

  return (
    <Box
      background="light-2"
      round
      pad="medium"
      gridArea={gridArea}
      style={{ position: "relative", paddingRight: "4rem" }}
    >
      <Paragraph margin="none" fill>
        {content}
      </Paragraph>
      <Paragraph fill margin="none" size="small" color="dark-3">
        {autoTranslate({ text: content, translation, lang })}
      </Paragraph>
      <Text
        size="xsmall"
        color="dark-4"
        style={{
          position: "absolute",
          right: size === "small" ? "0.7rem" : "1.45rem",
          bottom: size === "small" ? "0.7rem" : "1.45rem",
        }}
      >
        {formatTime(createdAt, lang.locale)}
      </Text>
    </Box>
  );
}
