import { Text } from "grommet";
import { Lang } from "i18n/langs";
import formatTime from "../helpers/formatTime";

type Props = {
  createdAt: Date;
  translated: string;
  lang: Lang;
};

export default function StatusMessage({ createdAt, translated, lang }: Props) {
  return (
    <Text
      textAlign="center"
      size="medium"
      dangerouslySetInnerHTML={{
        __html: `${translated} <small>${formatTime(
          createdAt,
          lang.locale
        )}</small>`,
      }}
    />
  );
}
