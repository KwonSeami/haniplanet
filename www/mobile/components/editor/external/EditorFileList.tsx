import * as React from 'react';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import FileList from './FileList';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';

interface Props {
  storyPK?: string;
}

const EditorFileList: React.FC<Props> = ({storyPK = ''}) => {
  const {watch, getValues, setValue} = useFormContext();
  const {file} = watch('attachments');

  // API
  const storyApi = useCallAccessFunc(access => new StoryApi(access));

  const onDeleteFile = React.useCallback((uid, {id}) => {
    if (!!id) {
      confirm('삭제시 다시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')
      && storyApi.deleteAttach(storyPK, 'file', id)
        .then(({status}) => {
          if (status === 200) {
            const {attachments} = getValues();
            setValue('attachments', {
              ...attachments,
              file: attachments.file.filter(item => item.id !== id),
            });
          }
        });
    } else {
      const {attachments} = getValues();
      setValue('attachments', {
        ...attachments,
        file: attachments.file.filter(({uid: currUid}) => currUid !== uid),
      });
    }
  }, [storyPK]);

  return (
    <FileList
      fileList={file}
      deleteFile={onDeleteFile}
    />
  );
};

export default React.memo(EditorFileList);