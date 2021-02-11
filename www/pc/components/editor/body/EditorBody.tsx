import * as React from 'react';
import {useDispatch} from 'react-redux';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import EditorDictSVG from '../EditorDictSVG';
import ApolloDictPopup from '../../dict/ApolloDictPopup';
import HaniDynamicEditor, {EditorLoading} from '../HaniDynamicEditor';
import ScrapApi from '../../../src/apis/ScrapApi';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {pushPopup} from '../../../src/reducers/popup';
import {TEditorAttachListState} from '../EditorPopup';
import EditorAdditionalContent from './EditorAdditionalContent';
import debounce from 'lodash/debounce';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import xorBy from 'lodash/xorBy';
import {embedUrlCard, urlExtractor} from '../../../src/lib/editor/utils';

interface Props {
  storyPK?: string;
  defaultTag?: any;
  defaultEditorBody?: any;
  editStoryStateLoading?: boolean;
  attachListState: TEditorAttachListState;
}

const EditorBody = React.memo<Props>(({storyPK, defaultTag, editStoryStateLoading, defaultEditorBody, attachListState}) => {
  const [_, setAttachList] = attachListState;
  const [initialized, setInitialized] = React.useState(!storyPK);

  const methods = useFormContext();
  const {setValue, getValues, register, watch} = methods;
  const {url_card} = watch('additionalContent');

  const dispatch = useDispatch();

  // API
  const uploadApi = useCallAccessFunc(access => (
    (type: 'file' | 'image', file) => new StoryApi(access).upload(type, file)
  ));

  const debouncedEmbedUrlCard = React.useCallback(debounce(embedUrlCard, 300), [embedUrlCard]);

  React.useEffect(() => {
    register({name: 'excludedUrlList'});
    setValue('excludedUrlList', []);
  }, []);

  React.useEffect(() => {
    if (!isEmpty(defaultEditorBody)) {
      setValue(
        'excludedUrlList',
        xorBy(
          [(url_card || {} as any).url],
          urlExtractor(defaultEditorBody) || []
        )
      );
      setInitialized(true);
    }
  }, [defaultEditorBody]);

  // 에디터 사용자 지정 버튼
  const editorCustomButton = [
    {
      name: '처방사전 첨부',
      element: <EditorDictSVG />,
      onClick: () => {
        dispatch(pushPopup(ApolloDictPopup, {
          setDictList: dict => {
            const {additionalContent} = getValues();

            setValue('additionalContent', {
              ...additionalContent,
              dictList: [
                ...additionalContent.dictList,
                dict,
              ],
            });
          },
        }));
      },
    }
  ];

  // 파일 uids 생성 함수
  const convertFileToUids = React.useCallback(
    (type: 'image' | 'file', file: File) => {
      const form = new FormData();
      form.append(type, file as File);

      return uploadApi(type, form)
        .then(({data: {results}}) => {
          if (!!results) {
            setAttachList(curr => ({...curr, [type]: [...curr[type], ...results]}));
            return type === 'image' ? results[0].image : null;
          }
        });
    }, [],
  );

  const fileConvertHandler = {
    file: file => convertFileToUids('file', file),
    image: image => convertFileToUids('image', image),
  };

  return (
    <div>
      {editStoryStateLoading ? (
        <EditorLoading />
      ) : (
        <HaniDynamicEditor
          customButton={editorCustomButton}
          defaultValue={defaultEditorBody}
          uploadHandler={fileConvertHandler}
          editorOnChange={body => {
            setValue('body', body);
            initialized && debouncedEmbedUrlCard(methods);
          }}
        />
      )}
      <EditorAdditionalContent
        storyPK={storyPK}
        defaultTag={defaultTag}
        attachListState={attachListState}
      />
    </div>
  )
});

export default EditorBody;
