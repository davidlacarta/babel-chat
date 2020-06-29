import React from "react";
import { Text } from "grommet";
import { Lang } from "i18n/langs";
import formatTime from "components/helpers/formatTime";

type Props = {
  createdAt: Date;
  translated: string;
  lang: Lang;
};

export default function StatusTime({ createdAt, translated, lang }: Props) {
  return (
    <Text
      textAlign="center"
      size="small"
      dangerouslySetInnerHTML={{
        __html: `${translated} <small>${formatTime(
          createdAt,
          lang.locale
        )}</small>`,
      }}
    />
  );
}
