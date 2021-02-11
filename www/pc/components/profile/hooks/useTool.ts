import * as React from 'react';
import ProfileApi from '../../../src/apis/ProfileApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {useDispatch, useSelector} from 'react-redux';
import {saveTool} from '../../../src/reducers/tool';
import {RootState} from '../../../src/reducers';
import isEmpty from 'lodash/isEmpty';

const useTool = () => {
  const dispatch = useDispatch();
  const tool = useSelector(({tool}: RootState) => tool);

  const profileApi: ProfileApi = useCallAccessFunc(access => new ProfileApi(access));

  const fetchTool = React.useCallback(() => {
    profileApi.tool()
      .then(({data: {result}}) => {
        !!result && dispatch(saveTool({toolData: result}));
      });
  }, []);

  React.useEffect(() => {
    if (isEmpty(tool)) {
      fetchTool();
    }
  }, [tool, fetchTool]);

  return tool;
};

export default useTool;
