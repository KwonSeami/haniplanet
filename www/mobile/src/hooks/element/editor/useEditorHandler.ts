import React from 'react';
import useFileHandler from '../input/useFileHandler';

const useEditorHandler = () => {
  const [editorBody, setEditorBody] = React.useState({
    version: 1,
    type: 'doc',
    content: [{ type: 'paragraph', content: []}]
  });
  const {fileConvertHandler, attachListState} = useFileHandler();

  // Callback
  const handleOnChangeEditorBody = React.useCallback(body => setEditorBody(body), []);

  return {
    fileConvertHandler,
    attachListState,
    editorBodyState: {editorBody, handleOnChangeEditorBody},
  };
};

export default useEditorHandler;
