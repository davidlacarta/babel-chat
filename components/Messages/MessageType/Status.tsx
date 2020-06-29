import React from "react";
import { Text } from "grommet";

type Props = {
  html: any;
  style?: any;
};

export default function Status({ html, style }: Props) {
  return (
    <Text
      textAlign="center"
      size="small"
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
