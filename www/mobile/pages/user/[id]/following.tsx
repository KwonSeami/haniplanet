import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../../components/common/Loading';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import FollowUser from '../../../components/user/FollowUser';
import {staticUrl} from '../../../src/constants/env';
import {userFollowingSelector} from '../../../src/reducers/orm/user/follow/selector';
import {fetchUserFollowing, followUser} from '../../../src/reducers/orm/user/follow/thunks';
import {MemberWrapDiv, NoContentText} from '../../../components/user/follow/commonStyleComp';
import loginRequired from '../../../hocs/loginRequired';


const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
`;

const FollowingMobile = React.memo<any>(() => {
  const {query: {id: userPk}} = useRouter();

  // Redux
  const dispatch = useDispatch();
  const {rest, users, myId} = useSelector(
    ({orm, system: {session: {id: myId}}}) => {
      const [users, rest] = userFollowingSelector(userPk)(orm);
      return {users, rest, myId};
    },
    (prev, curr) => isEqual(prev, curr),
  );

  // Data Fetch
  React.useEffect(() => {
    dispatch(fetchUserFollowing(userPk));
  }, [userPk]);

  const isMe = userPk === myId;

  return (
    <MemberWrapDiv>
      <h2>팔로우 <span>{rest.count}</span></h2>
      {!isEmpty(users) ? (
        <StyledInfiniteScroll
          loader={<Loading/>}
          hasMore={rest.next}
          loadMore={() => {
            dispatch(fetchUserFollowing(userPk, rest.next));
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
            alt="팔로우 하는 회원이 없습니다."
          />
          팔로우 하는 회원이 없습니다.
          {isMe && (
            <>
              <br/>
              추천 회원을 팔로우 해보세요!
            </>
          )}
        </NoContentText>
      )}
    </MemberWrapDiv>
  );
});
FollowingMobile.displayName = 'FollowingMobile';

export default loginRequired(FollowingMobile);
