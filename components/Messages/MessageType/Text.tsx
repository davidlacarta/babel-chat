import React, { useContext } from "react";
import { Grid, Text, Box, Avatar, Paragraph, ResponsiveContext } from "grommet";
import { Message } from "server/shared/types";
import { Lang } from "i18n/langs";
import formatAvatar from "components/helpers/formatAvatar";
import formatTime from "components/helpers/formatTime";

type Props = {
  message: Message;
  username: string;
  lang: Lang;
};

export default function MessageText({
  message: { author, content, translation, createdAt },
  username,
  lang,
}: Props) {
  const size = useContext(ResponsiveContext);
  const isAuthor = author === username;

  return (
    <Box animation="fadeIn" style={{ minHeight: "auto" }}>
      <Grid
        columns={isAuthor ? ["auto", "min-content"] : ["min-content", "auto"]}
        areas={isAuthor ? [["message", "avatar"]] : [["avatar", "message"]]}
        justifyContent={isAuthor ? "end" : "start"}
        gap="small"
        margin="medium"
      >
        <Avatar
          background={isAuthor ? "accent-1" : "accent-2"}
          gridArea={"avatar"}
          size={size === "small" ? "medium" : "large"}
        >
          <Text size={size === "small" ? "medium" : "large"}>
            {formatAvatar(author!)}
          </Text>
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
          <Paragraph fill margin="none" size="small" color="dark-3">
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
            {formatTime(createdAt, lang.locale)}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}
