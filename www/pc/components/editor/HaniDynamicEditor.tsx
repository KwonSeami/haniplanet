import * as React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Loading from '../common/Loading';
import NoContent from '../NoContent/NoContent';

interface IEditorErrComp {
  err: any;
}

export const EditorLoading = styled(Loading)`
  height: 568.56px;
`;

const EditorErrComp = React.memo<IEditorErrComp>(({err}) => (
  <NoContent>
    <p>에디터를 불러오는 중, 예기치 못한 에러가 발생하였습니다. 관리자에게 문의해주세요.</p>
    <code>{err.toString()}</code>
  </NoContent>
));

const HaniDynamicEditor = dynamic({
    ssr: false,
    loading: () => <EditorLoading />,
    loader: () => import(/* webpackChunkName: "@hanii/editor-core" */'@hanii/editor-core')
      .catch(err => () => (
        <EditorErrComp err={err} />
      )),
  },
);

export default HaniDynamicEditor;
