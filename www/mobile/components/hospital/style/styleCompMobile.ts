import styled from 'styled-components';
import {radiusMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY, $WHITE} from '../../../styles/variables.types';
 
export const MedicalFieldLi = styled.li`
  display: inline-block;
  width: 78px;
  height: 78px;
  padding: 10px 0;
  margin: 6px 0 0 6px;
  ${radiusMixin('15px', '#eee')};
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
  

  &:hover {
    border: 1px solid ${$GRAY};
  }

  &.on {
    background-color: #499aff;

    p {
      ${fontStyleMixin({
        size: 12,
        color: $WHITE
      })};
    }
  }

  img {
    width: 38px;
  }

  p {
    ${fontStyleMixin({
      size: 12,
      color: '#999'
    })};
  }
`;
