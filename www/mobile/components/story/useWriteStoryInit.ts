import * as React from 'react';

const useWriteStoryInit = () => {
  const [defaultAttachList, setDefaultAttachList] = React.useState({file: [], image: []});
  const [defaultOpenRange, setDefaultOpenRange] = React.useState(null);
  const [defaultDictList, setDefaultDictList] = React.useState([]);
  const [defaultTagList, setDefaultTagList] = React.useState([]);

  return {
    defaultOpenRangeState: {defaultOpenRange, setDefaultOpenRange},
    defaultAttachListState: {defaultAttachList, setDefaultAttachList},
    defaultDictListState: {defaultDictList, setDefaultDictList},
    defaultTagListState: {defaultTagList, setDefaultTagList},
  };
};

export default useWriteStoryInit;

