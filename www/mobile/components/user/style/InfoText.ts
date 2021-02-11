import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE} from '../../../styles/variables.types';

const InfoText = styled.p`
  width: 100%;
  background-color: #f5f7f9;
  text-align: center;
  font-size: 12px;
  padding: 12px 0;

  span {
    display: block;
    padding-bottom: 3px;
    ${fontStyleMixin({size: 11, color: $POINT_BLUE})}
  }
`;

export default InfoText;