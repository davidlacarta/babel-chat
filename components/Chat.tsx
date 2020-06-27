import { Grid, Box } from "grommet";
import MessageForm from "components/MessageForm";
import Messages from "components/Messages";
import useMessages from "./useMessages";

export type Props = {
  room: string;
  username: string;
};

export default function Chat({ room, username }: Props) {
  const { messages, writters, send, typing } = useMessages({
    room,
    username,
  });

  return (
    <Grid fill areas={[["messages"], ["input"]]} rows={["auto", "xsmall"]}>
      <Box align="center" gridArea="messages">
        <Messages messages={messages} writters={writters} />
      </Box>
      <Box align="center" gridArea="input">
        <MessageForm send={send} typing={typing} />
      </Box>
    </Grid>
  );
}
