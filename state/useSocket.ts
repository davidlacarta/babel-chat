import { useGlobalState } from "state/GlobalState";

export default function useSocket() {
  const {
    state: { socket },
  } = useGlobalState();

  return socket;
}
