import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../../../styles/variables.types';

export const NoContentLi = styled.li`
  text-align: center;
  height: 100%;
  padding-top: 96px;
  box-sizing: border-box;
  ${fontStyleMixin({size: 15, color: $TEXT_GRAY})};
`;
