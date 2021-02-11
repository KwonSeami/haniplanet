import styled from "styled-components";
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from "../../../styles/variables.types";
import {fontStyleMixin} from "../../../styles/mixins.styles";

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 15,
    color: $FONT_COLOR
  })};

  &.intro {
    height: 100%;
    border: none;
    padding: 0;
    margin: 0;
  }

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

export default TextArea;