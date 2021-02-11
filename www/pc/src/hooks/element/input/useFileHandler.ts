import * as React from 'react';
import StoryApi from '../../../apis/StoryApi';
import useCallAccessFunc from '../../session/useCallAccessFunc';

const useFileHandler = () => {
  const [attachList, setAttachList] = React.useState({file: [], image: []});

  const uploadApi = useCallAccessFunc(
    access => (type: 'file' | 'image', file) => new StoryApi(access).upload(type, file),
  );

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

  const fileConvertHandler = React.useMemo(() => ({
    image: image => convertFileToUids('image', image),
    file: file => convertFileToUids('file', file),
  }), [convertFileToUids]);

  return {
    fileConvertHandler,
    attachListState: {attachList, setAttachList},
  };
};

export default useFileHandler;
