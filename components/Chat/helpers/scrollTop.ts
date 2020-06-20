import { RefObject } from "react";

export default function scrollTop(ref: RefObject<any>) {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
}
