import * as React from 'react';
import isEqual from 'lodash/isEqual';
import {useSelector, useDispatch} from 'react-redux';
import {pickUserSelector, userListSelector} from '../../reducers/orm/user/selector';
import {RootState} from '../../reducers';
import {fetchUserListThunk} from '../../reducers/orm/user/thunks';
import {followUser} from '../../reducers/orm/user/follow/thunks';
import FeedApi from '../../apis/FeedApi';

const useUserRecommend = () => {
  const dispatch = useDispatch();

  const {
    user,
    userList: [users, rest],
    system: {session: {access}}
  } = useSelector(
    ({system, orm}: RootState) => ({
      user: pickUserSelector(system.session.id)(orm) || {} as any,
      userList: userListSelector('recommend')(orm),
      system
    }), 
    (prev, curr) => isEqual(prev, curr)
  );

  const fetchMore = React.useCallback((next: string) => {
    dispatch(fetchUserListThunk({listKey: 'recommend', next}));
  }, []);

  const toggleFollowUser = React.useCallback((id: HashId) => {
    dispatch(followUser(id));
  }, []);

  React.useEffect(() => {
    dispatch(fetchUserListThunk({
      listKey: 'recommend',
      api: new FeedApi(access).user()
    }));
  }, [access]);

  return {
    user,
    users,
    rest,
    fetchMore,
    toggleFollowUser
  };
};

export default useUserRecommend;
