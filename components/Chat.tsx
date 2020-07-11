import { Grid, Box } from "grommet";
import MessageInput from "components/MessageInput";
import Messages from "components/Messages";
import useWritters from "./useWritters";
import useMessages from "./useMessages";

export type Props = {
  room: string;
  username: string;
};

export default function Chat({ room, username }: Props) {
  const { messages, send } = useMessages({ room, username });
  const { writters, typing } = useWritters({ room, username });

  return (
    <Grid fill areas={[["messages"], ["input"]]} rows={["auto", "xsmall"]}>
      <Box align="center" gridArea="messages">
        <Messages messages={messages} writters={writters} />
      </Box>
      <Box align="center" gridArea="input">
        <MessageInput send={send} typing={typing} />
      </Box>
    </Grid>
  );
}
