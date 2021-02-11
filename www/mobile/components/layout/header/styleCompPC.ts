import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE} from '../../../styles/variables.types';

export const Ul = styled.ul`
  display: inline-block;
  vertical-align: middle;
  padding: 4px 0 0 6px;
`;

export const Li =  styled.li`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  padding-left: 15px;
`;

export const Label = styled.span`
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
