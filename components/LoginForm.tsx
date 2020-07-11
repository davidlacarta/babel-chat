import { KeyboardEvent, useRef, useEffect } from "react";
import { Box, Form, FormField, TextInput, Button } from "grommet";
import useUsername from "state/useUsername";
import useLangs from "state/useLangs";

export default function LoginForm() {
  const { setUsername } = useUsername();
  const { lang } = useLangs();

  const usernameRef = useRef<any>(null);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  function handleClick() {
    if (!usernameRef?.current?.value) {
      return;
    }

    setUsername(usernameRef.current.value);
  }

  function handleKeyDown({
    key,
    currentTarget: { value: text },
  }: KeyboardEvent<HTMLInputElement>) {
    if (!text || key !== "Enter") {
      return;
    }

    setUsername(text);
  }

  return (
    <Box fill align="center" justify="center">
      <Box width="medium">
        <Form
          style={{ margin: "1rem" }}
          onSubmit={(event: any) => event.preventDefault()}
        >
          <FormField name="name">
            <TextInput
              size="xxlarge"
              style={{ textAlign: "center" }}
              placeholder={lang.username}
              ref={usernameRef}
              onKeyDown={handleKeyDown}
            />
          </FormField>
          <Box direction="row" justify="center" margin={{ top: "medium" }}>
            <Button
              size="large"
              margin="medium"
              type="submit"
              primary
              label={lang.join}
              onClick={handleClick}
            />
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
