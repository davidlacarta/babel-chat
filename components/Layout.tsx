import React from "react";
import { Grid, Header, Main } from "grommet";
import useUsername from "state/useUsername";
import ChatHeader from "./Header";
import UsernameForm from "./UsernameForm";
import Chat from "./Chat";

type Props = {
  room: string;
};

export default function Layout({ room }: Props) {
  const { username } = useUsername();

  return (
    <Page
      header={<ChatHeader room={room} />}
      main={
        username ? <Chat room={room} username={username} /> : <UsernameForm />
      }
    />
  );
}

function Page({ header, main }: any) {
  return (
    <Grid fill rows={["xsmall", "auto"]} areas={[["header"], ["main"]]}>
      <Header justify="center" gridArea="header" background="dark-1">
        {header}
      </Header>
      <Main gridArea="main">{main}</Main>
    </Grid>
  );
}
