import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 8px 10px;
  margin-top: 6px;
  ${fontStyleMixin({
    size: 14,
    color: $FONT_COLOR
  })};
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

export default TextArea;
