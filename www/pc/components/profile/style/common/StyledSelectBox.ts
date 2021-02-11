import styled from 'styled-components';
import SelectBox from '../../../inputs/SelectBox';
import {$POINT_BLUE} from '../../../../styles/variables.types';

const StyledSelectBox = styled(SelectBox)`
  width: 132px;
  position: absolute;
  right: 0;
  top: 0;

  p {
    color: ${$POINT_BLUE};
  }
`;

export default StyledSelectBox;