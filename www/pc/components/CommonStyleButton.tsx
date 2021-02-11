import * as React from "react";
import Button from "./inputs/Button/ButtonDynamic";
import {ButtonProps} from "./inputs/Button";
import {$FONT_COLOR, $WHITE} from "../styles/variables.types";

const CommonStyleButton = React.memo<ButtonProps>(
  ({color, backgroundColor, ...props}) => (
    <Button
      size={{width: '140px', height: '36px'}}
      font={{size: '14px', weight: '600', color: color || $FONT_COLOR}}
      border={{radius: '0'}}
      backgroundColor={backgroundColor || $WHITE}
      {...props}
    />
  ),
);

export default CommonStyleButton;
