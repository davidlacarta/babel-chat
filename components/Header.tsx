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
    <Container>
      <HeadingBabel>
        <Heading margin="none">Babel</Heading>
        <PrivateMark show={isRoomPrivate} />
      </HeadingBabel>
      <ButtonLanguages toogle={toogleLang}>
        <Flag lang={lang} />
      </ButtonLanguages>
    </Container>
  );
}

const Container = ({ children }: any) => (
  <Box
    direction="row"
    fill="horizontal"
    align="center"
    justify="between"
    width={{ max: "800px" }}
    pad={{ horizontal: "large" }}
  >
    {children}
  </Box>
);

const HeadingBabel = ({ children }: any) => (
  <Box direction="row" align="center">
    {children}
  </Box>
);

const ButtonLanguages = ({ children, toogle }: any) => (
  <Button
    style={{
      width: "2rem",
      height: "2rem",
    }}
    onClick={toogle}
  >
    {children}
  </Button>
);

const Flag = ({ lang }: { lang: Lang }) =>
  lang.code === "es" ? <Es /> : <Uk />;

const PrivateMark = ({ show }: { show: boolean }) =>
  (show && <Text style={{ margin: "1rem" }}>{`🔒`}</Text>) || <></>;
