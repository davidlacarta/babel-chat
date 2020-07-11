import React from "react";
import { Text } from "grommet";
import { Lang } from "i18n/langs";

type Props = {
  writters: Array<string>;
  username: string;
  lang: Lang;
};

export default function UsersTyping({ writters, username, lang }: Props) {
  const writtersWithoutMe = writters.filter((writter) => writter !== username);
  const html =
    writtersWithoutMe.length > 0 ? lang.typing(writtersWithoutMe) : "";

  return (
    <Text
      textAlign="center"
      size="medium"
      style={{ minHeight: "2rem" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
