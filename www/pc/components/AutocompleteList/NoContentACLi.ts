import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $WHITE} from '../../styles/variables.types';

const NoContentLi = styled.li`
  height: auto !important;
  padding: 29px 0 67px !important;
  margin: 0 !important;
  box-sizing: border-box;
  text-align: center;
  
  ${fontStyleMixin({
    size: 13,
    color: $TEXT_GRAY,
  })}

  &:hover {
    background-color: ${$WHITE} !important;
  }
`;

export default NoContentLi;
