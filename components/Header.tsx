import React from "react";
import { Box, Heading, Button, Text } from "grommet";
import Es from "./flags/Es";
import Uk from "./flags/Uk";
import useLangs from "state/useLangs";
import { Lang } from "i18n/langs";

export type Props = {
  room: string;
};

export default function ChatHeader({ room }: Props) {
  const { lang, toogle: toogleLang } = useLangs();

  const isRoomPrivate = room !== "general";

  return (
    <Box
      direction="row"
      fill="horizontal"
      align="center"
      justify="between"
      width={{ max: "800px" }}
      pad={{ horizontal: "large" }}
    >
      <Box direction="row" align="center">
        <Heading margin="none">Babel</Heading>
        <PrivateMark show={isRoomPrivate} />
      </Box>
      <Button style={{ width: "2rem", height: "2rem" }} onClick={toogleLang}>
        <Flag lang={lang} />
      </Button>
    </Box>
  );
}

function Flag({ lang }: { lang: Lang }) {
  return lang.code === "es" ? <Es /> : <Uk />;
}

function PrivateMark({ show }: { show: boolean }) {
  return (show && <Text margin="1rem">{`🔒`}</Text>) || <></>;
}
