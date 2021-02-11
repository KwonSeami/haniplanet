import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';

const NoContentText = styled.p`
  width: 680px;
  padding: 62px 0 68px;
  margin: auto;
  border: 1px solid ${$BORDER_COLOR};
  border-top-color: ${$FONT_COLOR};
  text-align: center;
  box-sizing: border-box;
  ${fontStyleMixin({size: 14, color: $TEXT_GRAY})}

  img {
    width: 25px;
    margin: auto;
    display: block;
    padding-bottom: 8px;
  }
`;

export default NoContentText;
