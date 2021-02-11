import * as React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import EditorAdditionalContent from './EditorAdditionalContent';
import EditorDictSVG from '../../Feed/write/editor/EditorDictSVG';
import useEditorHandler from '../../../src/hooks/element/editor/useEditorHandler';
import {pushPopup} from '../../../src/reducers/popup';
import {dispatch as editorDispatch, useGlobalState} from '../editorState';
import EditorConfirmBtn from './EditorConfirmBtn';
import TagApi from '../../../src/apis/TagApi';
import {useRouter} from 'next/router';
import HaniDynamicEditor from '../HaniDynamicEditor';
import ApolloDictPopup from '../../dict/ApolloDictPopup';
import {HashId} from '@hanii/planet-types';

interface Props {
  isCommunity?: boolean;
  isCounsel?: boolean;
  storyPK: HashId;
  writeStoryApi: any;
  defaultEditorBody?: object;
  defaultAttachList?: any;
}

const saveTag = value => editorDispatch({
  type: 'SAVE_OBJ_FIELD',
  field: 'additionalContent',
  name: 'tags',
  value,
});

const setDictList = dict => editorDispatch({
  type: 'SAVE_ADDITIONAL_CONTENT',
  field: 'dictList',
  value: dict,
});

const EditorBody = (props: Props) => {
  const {storyPK, isCounsel, writeStoryApi, defaultEditorBody, defaultAttachList, isCommunity = false} = props;

  const [isTagLoad, setIsTagLoad] = React.useState(false);
  const {fileConvertHandler, attachListState, editorBodyState: {editorBody, handleOnChangeEditorBody}} = useEditorHandler();
  const [additionalContent] = useGlobalState('additionalContent');

  const {query: {defaultTagId}} = useRouter();

  // Redux
  const access = useSelector(
    ({system: {session: {access}}}) => access,
    shallowEqual
  );

  React.useEffect(() => {
    if (!!defaultTagId) {
      new TagApi(access).retrieve(defaultTagId as string)
        .then(({data: {result}}) => {
          !!result && saveTag([result]);
          setIsTagLoad(true);
        })
        .catch(() => setIsTagLoad(true));
    } else {
      setIsTagLoad(true);
    }
  }, [defaultTagId, access]);

  const dispatch = useDispatch();

  // 에디터 사용자 지정 버튼
  const editorCustomButton = React.useMemo(() => [
    {
      name: '처방사전 첨부',
      element: <EditorDictSVG />,
      onClick: () => {
        dispatch(pushPopup(ApolloDictPopup, {setDictList}));
      },
    },
  ], []);

  return (
    <div>
      <HaniDynamicEditor
        defaultValue={defaultEditorBody}
        customButton={editorCustomButton}
        uploadHandler={fileConvertHandler}
        editorOnChange={handleOnChangeEditorBody}
      />
      {isTagLoad && (
        <EditorAdditionalContent
          storyPK={storyPK}
          attachListState={attachListState}
          additionalContent={additionalContent}
          defaultAttachList={defaultAttachList}
          isCommunity={isCommunity}
        />
      )}
      <EditorConfirmBtn
        isCounsel={isCounsel}
        isCommunity={isCommunity}
        attachListState={attachListState}
        editorBody={editorBody}
        writeStoryApi={writeStoryApi}
      />
    </div>
  );
};

export default React.memo<Props>(EditorBody);
