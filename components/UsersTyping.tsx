import React from "react";
import { Text } from "grommet";
import { Lang } from "i18n/langs";

export default function UsersTyping({
  writters,
  username,
  lang,
}: {
  writters: Array<string>;
  username: string;
  lang: Lang;
}) {
  const writtersWithoutMe = writters.filter((writter) => writter !== username);
  const html =
    writtersWithoutMe.length > 0 ? lang.typing(writtersWithoutMe) : "";

  return (
    <Text
      textAlign="center"
      size="small"
      style={{ minHeight: "2rem" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
