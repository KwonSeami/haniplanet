import * as React from 'react';
import dynamic from 'next/dynamic';
import NoContent from '../../NoContent/NoContent';

interface IEditorErrComp {
  err: any;
}

const EditorErrComp: React.FC<IEditorErrComp> = ({err}) => (
  <NoContent>
    <p>에디터를 불러오는 중, 예기치 못한 에러가 발생하였습니다. 관리자에게 문의해주세요.</p>
    <code>{err.toString()}</code>
  </NoContent>
);
const MemoEditorErrComp = React.memo(EditorErrComp);

const DynamicHaniEditorCore = dynamic({
  ssr: false,
  loader: () => import('./HaniEditorCore').catch(err => () => (
    <MemoEditorErrComp err={err}/>
  )),
});

export default DynamicHaniEditorCore;
