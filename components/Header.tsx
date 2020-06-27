import React from "react";
import { Header, Box, Heading, Button, Text } from "grommet";
import Es from "./flags/Es";
import Uk from "./flags/Uk";
import useLangs from "state/useLangs";

export type Props = {
  room: string;
};

export default function ChatHeader({ room }: Props) {
  const { lang, toogle: toogleLang } = useLangs();

  return (
    <Header justify="center" gridArea="header" background="dark-1">
      <Box
        direction="row"
        fill="horizontal"
        align="center"
        justify="between"
        width={{ max: "800px" }}
        pad={{ horizontal: "large" }}
      >
        <Box direction="row" align="center">
          <Heading>Babel</Heading>
          {room && <Text style={lockStyles}>{`🔒`}</Text>}
        </Box>
        <Button style={flagStyles} onClick={toogleLang}>
          {lang.code === "es" ? <Es /> : <Uk />}
        </Button>
      </Box>
    </Header>
  );
}

const flagStyles = {
  width: "2rem",
  height: "2rem",
};

const lockStyles = {
  margin: "1rem",
};
