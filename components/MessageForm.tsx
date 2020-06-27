import { KeyboardEvent, useRef, useEffect } from "react";
import { Send } from "grommet-icons";
import { Grid, Box, FormField, TextInput, Button } from "grommet";
import useUsername from "state/useUsername";
import useLangs from "state/useLangs";
import { TypingType } from "server/shared/types";
import clearInput from "./helpers/clearInput";

type Props = {
  send: (message: string) => void;
  typing: (type: TypingType) => void;
};

function MessageForm({ send: sendMessage, typing }: Props) {
  const { username } = useUsername();
  const { lang } = useLangs();

  const messageRef = useRef<any>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, [username]);

  function handleClick() {
    if (messageRef?.current?.value) {
      send(messageRef.current.value);
    }
  }

  function handleKeyDown({
    key,
    currentTarget: { value },
  }: KeyboardEvent<HTMLInputElement>) {
    if (!value) {
      typing(TypingType.STOP);
      return;
    }

    typing(TypingType.START);

    if (key === "Enter") {
      send(value);
    }
  }

  function handleBlur() {
    typing(TypingType.STOP);
  }

  function send(text: string) {
    clearInput(messageRef);

    typing(TypingType.STOP);

    sendMessage(text);
  }
  return (
    <Grid
      as="form"
      columns={["auto", "min-content"]}
      align="center"
      gap="small"
      pad={{ horizontal: "medium" }}
      style={{ maxWidth: "800px" }}
      fill
      onSubmit={(event) => event.preventDefault()}
    >
      <Box fill="horizontal">
        <FormField margin="0">
          <TextInput
            placeholder={lang.message}
            ref={messageRef}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </FormField>
      </Box>
      <Button type="submit" primary icon={<Send />} onClick={handleClick} />
    </Grid>
  );
}

export default MessageForm;
