import * as React from 'react';
import styled from "styled-components";
import {$TEXT_GRAY} from "../../styles/variables.types";
import {fontStyleMixin} from "../../styles/mixins.styles";
import NoContentText from '../../components/NoContent/NoContentText';

const Div = styled(NoContentText)`
  padding: 59px 0;
  
  ul {
    margin: 24px auto 0;

    li {
      line-height: 19px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
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
        <li>2. 검색어의 단어 수를 줄이거나,<br/> 보다 일반적인 검색어로 다시 검색해보세요.</li>
        <li>3. 키워드에 있는 특수문자를 뺀 후에 검색해 보세요.</li>
      </ul>
      {children}
    </Div>
  );
};

export default React.memo(SearchNoContentText);
