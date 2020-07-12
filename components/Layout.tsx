import React from "react";
import { Grid, Header, Main } from "grommet";
import useUsername from "state/useUsername";
import ChatHeader from "./Header";
import LoginForm from "./LoginForm";
import Chat from "./Chat";

type Props = {
  room: string;
};

export default function Layout({ room }: Props) {
  const { username } = useUsername();

  return (
    <Grid fill rows={["xsmall", "auto"]} areas={[["header"], ["main"]]}>
      <Header justify="center" gridArea="header" background="light-2">
        <ChatHeader room={room} />
      </Header>
      <Main gridArea="main">
        {username ? <Chat room={room} username={username} /> : <LoginForm />}
      </Main>
    </Grid>
  );
}
