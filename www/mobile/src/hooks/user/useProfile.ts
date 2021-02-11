import * as React from 'react';
import isEqual from 'lodash/isEqual';
import queryString from 'query-string';
import useLocation from '../router/useLocation';
import {fetchUserThunk} from '../../reducers/orm/user/thunks';
import {pickUserSelector} from '../../reducers/orm/user/selector';
import {useDispatch, useSelector} from 'react-redux';
import {PROFILE_TAB} from '../../constants/profile';

const useProfile = (id: HashId) => {
  const dispatch = useDispatch();
  const {location: {search}} = useLocation();

  const {tab} = queryString.parse(search);
  const currTab = PROFILE_TAB[tab] || '';

  const {user, me} = useSelector(
    ({system: {session: {id: myId}}, orm}) => ({
      user: pickUserSelector(id)(orm) || {} as any,
      me: pickUserSelector(myId)(orm) || {} as any
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  React.useEffect(() => {
    id && dispatch(fetchUserThunk(id));
  }, [id]);

  return {
    user,
    me,
    currTab
  };
};

export default useProfile;
