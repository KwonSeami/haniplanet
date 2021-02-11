import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE} from '../../../styles/variables.types';

const TextMsgLi = styled.li`
  text-align: center;
  padding: 12px 0 !important;
  margin: 10px 0 21px;
  font-size: 12px;
  background-color: #f5f7f9;

  & > span {
    display: block;
    margin: auto;
    padding: 0 0 2px !important;
    ${fontStyleMixin({size: 11, weight: '600', color: $POINT_BLUE})}
  }
`;

export default TextMsgLi;