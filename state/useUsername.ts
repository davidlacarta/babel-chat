import { useGlobalState, ACTIONS } from "state/GlobalState";

export default function useUsername() {
  const {
    state: { username: usernameState },
    dispatch,
  } = useGlobalState();

  function setUsername(username: string) {
    dispatch({ type: ACTIONS.CHANGE_USERNAME, payload: username });
  }

  return {
    username: usernameState,
    setUsername,
  } as { username: string; setUsername: (username: string) => void };
}
