import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../../../styles/mixins.styles';
import {$POINT_BLUE, $WHITE} from '../../../../../styles/variables.types';

const AlarmCountLabel = styled.span`
  position: absolute;
  right: -8px;
  top: 4px;
  display: block;
  width: 25px;
  ${heightMixin(15)};
  border-radius: 10px;
  background-color: ${$POINT_BLUE};
  text-align: center;
  line-height: 15px;
  ${fontStyleMixin({
    size: 9,
    weight: '600',
    family: 'Montserrat',
    color: $WHITE
  })};
`;

export default AlarmCountLabel;
