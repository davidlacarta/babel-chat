import React from "react";
import DynamicStyledSystemComponent, {
  StyledSystemProps,
} from "./DynamicStyledSystemComponent";
import { typographyStyles } from "./typograpyStyles";

interface TypographyComponentProps {
  H1: React.FC<StyledSystemProps>;
  H2: React.FC<StyledSystemProps>;
  H3: React.FC<StyledSystemProps>;
  H4: React.FC<StyledSystemProps>;
  H5: React.FC<StyledSystemProps>;
  LargeLead: React.FC<StyledSystemProps>;
  SmallLead: React.FC<StyledSystemProps>;
  Paragraph: React.FC<StyledSystemProps>;
  SmallParagraph: React.FC<StyledSystemProps>;
}

const createComponent: (
  textStyle: StyledSystemProps,
  displayName: string
) => React.FC<StyledSystemProps> = (textStyle, displayName) => {
  const component: React.FC<StyledSystemProps> = (props) => (
    <DynamicStyledSystemComponent {...textStyle} {...props}>
      {props.children}
    </DynamicStyledSystemComponent>
  );
  component.displayName = displayName;
  return component;
};

export const Typography: TypographyComponentProps = {
  H1: createComponent(typographyStyles.H1, "H1"),
  H2: createComponent(typographyStyles.H2, "H2"),
  H3: createComponent(typographyStyles.H3, "H3"),
  H4: createComponent(typographyStyles.H4, "H4"),
  H5: createComponent(typographyStyles.H5, "H5"),
  LargeLead: createComponent(typographyStyles.LargeLead, "LargeLead"),
  SmallLead: createComponent(typographyStyles.SmallLead, "SmallLead"),
  Paragraph: createComponent(typographyStyles.Paragraph, "Paragraph"),
  SmallParagraph: createComponent(
    typographyStyles.SmallParagraph,
    "SmallParagraph"
  ),
};
