import * as React from 'react';
import styled from 'styled-components';
import AutocompleteList, {AutocompleteUl} from '../../../AutocompleteList';
import {IAcCompProps} from '../SearchBaseInput';
import {$BORDER_COLOR, $TEXT_GRAY, $WHITE} from '../../../../styles/variables.types';

export const TagDiv = styled.div`
  margin-top: -1px;
  border: 1px solid ${$BORDER_COLOR};
  background-color: ${$WHITE};

  ${AutocompleteUl} {
    border: 0;
    padding: 6px 0;

     .right-content {
        right: 17px;
        top: 4px;

      p {
        color: ${$TEXT_GRAY};
      }
     }
  }
`;

interface Props extends IAcCompProps {
  isTagInsideList: boolean;
  inputValue?: string;
}

const AutoTagList = React.memo<Props>((props) => (
  <TagDiv>
    <AutocompleteList {...props} />
  </TagDiv>
));

AutoTagList.displayName  = 'AutoTagList';
export default AutoTagList;
