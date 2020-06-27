import { RefObject } from "react";

export default function clearInput(ref: RefObject<HTMLInputElement>) {
  if (ref.current) {
    ref.current.value = "";
  }
}
