import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE} from '../../../styles/variables.types';

const PolicyTable = styled.table`
  color: ${$WHITE};
  border-bottom: 0;

  th, td {
    min-width: 78px;
    text-align: left;
    ${fontStyleMixin({
      size: 13,
      weight: 'normal'
    })}
    padding: 10px;
    border-right: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  th {
    background-color: #b3c4ce;
  }
`;

export default PolicyTable;