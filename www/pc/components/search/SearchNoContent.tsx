import * as React from 'react';
import styled from "styled-components";
import {$BORDER_COLOR, $TEXT_GRAY, $GRAY} from "../../styles/variables.types";
import {fontStyleMixin} from "../../styles/mixins.styles";
import NoContentText from '../../components/NoContent/NoContentText';

const Div = styled(NoContentText)`
  padding: 75px 0;
  border-top: 1px solid ${$GRAY};
  border-bottom: 1px solid ${$BORDER_COLOR};
  
  ul {
    width: 376px;
    line-height: 21px;
    padding-left: 10px;
    margin: 31px auto 0;
    border-left: 5px solid #ecedef;
    text-align: left;

    li {
      line-height: 15px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};

      & ~ li {
        margin-top: 6px;
      }
    }
  }
`;

interface Props {
  children?: React.ReactNode;
}

const SearchNoContentText: React.FC<Props> = ({
  children
}) => {
  return (
    <Div>
      <p>검색결과가 없습니다.</p>
      <ul>
        <li>1. 단어의 철자가 정확한지 확인 해보세요.</li>
        <li>2. 검색어의 단어 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해보세요.</li>
        <li>3. 키워드에 있는 특수문자를 뺀 후에 검색해 보세요.</li>
      </ul>
      {children}
    </Div>
  );
};

export default React.memo(SearchNoContentText);
