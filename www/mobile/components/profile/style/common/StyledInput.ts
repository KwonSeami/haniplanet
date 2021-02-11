import styled from 'styled-components';
import Input from '../../../inputs/Input';
import {$BORDER_COLOR} from '../../../../styles/variables.types';

const StyledInput = styled(Input)<Pick<IProfileBasicInfo, 'isButton' | 'isBasic'>>`
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  font-size: 14px;

  ${props => props.isBasic && `
    width: 429px;
  `}

  ${props => props.isButton && `
    display: inline-block !important;
    vertical-align: top;
    width: 310px;
  `}
`;

export default StyledInput;