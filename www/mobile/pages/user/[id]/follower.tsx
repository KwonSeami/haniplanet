import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../components/common/Loading';
import FollowUser from '../../../components/user/FollowUser';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import {staticUrl} from '../../../src/constants/env';
import {userFollowerSelector} from '../../../src/reducers/orm/user/follow/selector';
import {fetchUserFollower, followUser} from '../../../src/reducers/orm/user/follow/thunks';
import {MemberWrapDiv, NoContentText} from '../../../components/user/follow/commonStyleComp';
import loginRequired from '../../../hocs/loginRequired';

const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
`;

const FollowerListMobile = React.memo<any>(() => {
  const {query: {id: userPk}} = useRouter();

  // Redux
  const dispatch = useDispatch();
  const {rest, users, myId} = useSelector(
    ({orm, system: {session: {id: myId}}}) => {
      const [users, rest] = userFollowerSelector(userPk)(orm);
      return {users, rest, myId};
    },
  );

  // Data Fetch
  React.useEffect(() => {
    dispatch(fetchUserFollower(userPk));
  }, [userPk]);

  const isMe = userPk === myId;

  return (
    <MemberWrapDiv>
      <h2>팔로워 <span>{rest.count}</span></h2>
      {!isEmpty(users) ? (
        <StyledInfiniteScroll
          loader={<Loading/>}
          hasMore={rest.next}
          loadMore={() => {
            dispatch(fetchUserFollower(userPk, rest.next));
          }}
          threshold="-150px"
        >
          <ul className="clearfix">
            {users.map((user) => (
              <FollowUser
                key={user.id}
                {...user}
                myId={myId}
                onClick={() => dispatch(followUser(user.id))}
              />
            ))}
          </ul>
        </StyledInfiniteScroll>
      ) : (
        <NoContentText>
          <img
            src={staticUrl('/static/images/icon/icon-follow-null.png')}
            alt={`${isMe && '나를'} 팔로우하는 회원이 없습니다.`}
          />
          {isMe && '나를'} 팔로우하는 회원이 없습니다.
        </NoContentText>
      )}
    </MemberWrapDiv>
  );
});
FollowerListMobile.displayName = 'FollowerListMobile';

export default loginRequired(FollowerListMobile);
