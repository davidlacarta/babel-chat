import { Text } from "grommet";
import { Lang } from "i18n/langs";
import formatTime from "../helpers/formatTime";

export default function StatusMessage({
  createdAt,
  translated,
  lang,
}: {
  createdAt: Date;
  translated: string;
  lang: Lang;
}) {
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
