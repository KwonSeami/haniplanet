import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../../../styles/variables.types';


const AlarmNoContentLi = styled.li`
  padding: 30px 30px 0px 30px;
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 15,
    color: $TEXT_GRAY
  })};
`;

export default AlarmNoContentLi;
